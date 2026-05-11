import { getToken } from '@/lib/session';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

export { getToken };

/** Public GET (no auth header). Used for referrer lookup on register. */
export async function apiFetchPublic(path: string): Promise<unknown> {
  const response = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  const data = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) {
    throw new Error(data.message || `API error: ${response.status}`);
  }
  return data;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `API error: ${response.status}`);
  }
  return data;
}

export type KycStatus = 'unverified' | 'pending' | 'approved' | 'rejected';

export type AuthUser = {
  id: string;
  userCode?: string;
  name: string;
  email: string;
  role: string;
  referralCode?: string;
  preferredCommunity?: string;
  mobileNumber?: string;
  kycStatus?: KycStatus;
};

export type AuthResponse = { success: boolean; data: { user: AuthUser; token: string } };

export async function authLogin(email: string, password: string): Promise<AuthResponse> {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function authRegister(body: {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  referralCode: string;
  community: 'left' | 'right';
}): Promise<AuthResponse> {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getReferrerLookup(code: string): Promise<ApiSuccess<{ name: string; userCode: string }>> {
  const q = new URLSearchParams({ code: code.trim() });
  return apiFetchPublic(`/api/auth/referrer-lookup?${q}`) as Promise<ApiSuccess<{ name: string; userCode: string }>>;
}

export type ApiSuccess<T> = { success: boolean; data: T };

export async function getAuthMe(): Promise<ApiSuccess<AuthUser>> {
  return apiFetch('/api/auth/me');
}

export async function putAuthMe(body: {
  name?: string;
  email?: string;
  preferredCommunity?: "left" | "right";
}): Promise<ApiSuccess<AuthUser>> {
  return apiFetch('/api/auth/me', {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function patchMyPassword(body: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ApiSuccess<{ message?: string }>> {
  return apiFetch('/api/auth/me/password', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export type KycSummary = {
  status: KycStatus;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  reviewReason?: string;
};

export async function getMyKyc(): Promise<ApiSuccess<KycSummary>> {
  return apiFetch('/api/kyc/me');
}

export type KycDocumentKind = 'aadhaarFront' | 'aadhaarBack' | 'pan' | 'photo';

export type KycBankInput = {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId?: string;
};

export async function postKycSubmit(body: {
  aadhaarFront: File;
  aadhaarBack: File;
  pan: File;
  photo: File;
  bank: KycBankInput;
}): Promise<ApiSuccess<KycSummary>> {
  const form = new FormData();
  form.append('aadhaarFront', body.aadhaarFront);
  form.append('aadhaarBack', body.aadhaarBack);
  form.append('pan', body.pan);
  form.append('photo', body.photo);
  form.append('accountHolderName', body.bank.accountHolderName);
  form.append('bankName', body.bank.bankName);
  form.append('accountNumber', body.bank.accountNumber);
  form.append('ifscCode', body.bank.ifscCode);
  form.append('upiId', body.bank.upiId || '');
  return apiFetch('/api/kyc/me', {
    method: 'POST',
    body: form,
  });
}

export async function getMyKycDocumentBlob(kind: KycDocumentKind): Promise<Blob> {
  const token = getToken();
  const headers = new Headers();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${API_BASE}/api/kyc/me/document/${kind}`, { headers, cache: 'no-store' });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message || `Failed to fetch document (${res.status})`);
  }
  return res.blob();
}

export type AdminKycRow = {
  userCode: string;
  name: string;
  email: string;
  kyc: KycSummary;
  createdAt?: string;
};

export async function getAdminKycList(
  page = 1,
  limit = 20,
  status?: 'pending' | 'approved' | 'rejected' | 'unverified' | 'all',
  q?: string
): Promise<{ success: boolean; data: AdminKycRow[]; meta: PaginatedMeta }> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.set('status', status);
  if (q?.trim()) params.set('q', q.trim());
  return apiFetch(`/api/admin/kyc?${params}`);
}

export async function patchAdminKycReview(
  userCode: string,
  body: { status: 'approved' | 'rejected'; reason: string }
): Promise<ApiSuccess<AdminKycRow>> {
  return apiFetch(`/api/admin/kyc/${encodeURIComponent(userCode)}/review`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function getAdminKycDocumentBlob(userCode: string, kind: KycDocumentKind): Promise<Blob> {
  const token = getToken();
  const headers = new Headers();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${API_BASE}/api/admin/media/kyc/${encodeURIComponent(userCode)}/${kind}`, {
    headers,
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch KYC document (${res.status})`);
  return res.blob();
}

export type WalletDto = {
  balance: number;
  eligibleToWithdraw: number;
};

export async function getWalletMe(): Promise<ApiSuccess<WalletDto | null>> {
  return apiFetch('/api/wallet/me');
}

export type FundRequestRow = {
  id: string;
  requestedAmount: number;
  approvedAmount: number | null;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  paymentProofPath?: string;
  createdAt?: string;
  userId?: string | { id?: string; name?: string; email?: string; userCode?: string };
};

export async function postFundRequest(body: { amount: number; notes?: string; screenshot: File }): Promise<ApiSuccess<FundRequestRow>> {
  const form = new FormData();
  form.append('amount', String(body.amount));
  if (body.notes?.trim()) form.append('notes', body.notes.trim());
  form.append('screenshot', body.screenshot);
  return apiFetch('/api/fund-requests', {
    method: 'POST',
    body: form,
  });
}

export type PaginatedMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedFundRequests = {
  success: boolean;
  data: FundRequestRow[];
  meta: PaginatedMeta;
};

export async function getMyFundRequests(page = 1, limit = 20): Promise<PaginatedFundRequests> {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  return apiFetch(`/api/fund-requests/me?${q}`);
}

export async function getAdminFundRequests(
  page = 1,
  limit = 20,
  filters?: { status?: '' | 'pending' | 'approved' | 'rejected'; q?: string; from?: string; to?: string }
): Promise<PaginatedFundRequests> {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (filters?.status) q.set('status', filters.status);
  if (filters?.q?.trim()) q.set('q', filters.q.trim());
  if (filters?.from?.trim()) q.set('from', filters.from.trim());
  if (filters?.to?.trim()) q.set('to', filters.to.trim());
  return apiFetch(`/api/fund-requests/admin?${q}`);
}

export type AuditLogRow = {
  id: string;
  action: string;
  actorUserId?: string;
  details?: Record<string, unknown>;
  createdAt?: string;
};

export type AdminFundRequestDetail = {
  request: FundRequestRow & { reviewMetadata?: Record<string, unknown> };
  audit: AuditLogRow[];
};

export async function getAdminFundRequestDetail(id: string): Promise<ApiSuccess<AdminFundRequestDetail>> {
  return apiFetch(`/api/fund-requests/admin/${id}`);
}

export async function getAdminPaymentProofBlob(id: string): Promise<Blob> {
  const token = getToken();
  const headers = new Headers();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${API_BASE}/api/admin/media/payment-proof/${id}`, { headers, cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch payment proof: ${res.status}`);
  return res.blob();
}

export type AdminOverviewDto = {
  totals: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    pendingFundRequests: number;
    pendingWithdrawals: number;
    totalPlans: number;
    totalPackages: number;
    tradeIncomeTotal: number;
    sponsorIncomeTotal: number;
    matchingIncomeTotal: number;
    totalIncome: number;
  };
  series: Array<{ day: string; fundRequestsAmount: number; purchaseAmount: number; approvedWithdrawalsOut: number }>;
};

export async function getAdminOverview(days = 14): Promise<ApiSuccess<AdminOverviewDto>> {
  return apiFetch(`/api/admin/overview?days=${days}`);
}

export type AdminPlanRow = PlanRow & { isActive?: boolean };
export type AdminPackageProductRow = PackageProductRow & { isActive?: boolean };

export async function getAdminPlans(): Promise<ApiSuccess<AdminPlanRow[]>> {
  return apiFetch('/api/admin/plans');
}

export async function postAdminPlan(body: {
  code: string;
  name: string;
  dailyPercent: number;
  cycleDaysW: number;
  maxWorkingDaysN: number;
  sponsorPercent?: number;
  summary?: string;
  detailHelp?: string;
  isActive?: boolean;
}): Promise<ApiSuccess<AdminPlanRow>> {
  return apiFetch('/api/admin/plans', { method: 'POST', body: JSON.stringify(body) });
}

export async function patchAdminPlan(
  code: string,
  body: {
    name?: string;
    dailyPercent?: number;
    cycleDaysW?: number;
    maxWorkingDaysN?: number;
    sponsorPercent?: number;
    summary?: string;
    detailHelp?: string;
    isActive?: boolean;
  }
): Promise<ApiSuccess<AdminPlanRow>> {
  return apiFetch(`/api/admin/plans/${encodeURIComponent(code)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function getAdminPackageProducts(): Promise<ApiSuccess<AdminPackageProductRow[]>> {
  return apiFetch('/api/admin/package-products');
}

export async function postAdminPackageProduct(body: {
  code: string;
  name: string;
  amount: number;
  shortDescription?: string;
  detailHelp?: string;
  features?: string[];
  sortOrder?: number;
  isActive?: boolean;
}): Promise<ApiSuccess<AdminPackageProductRow>> {
  return apiFetch('/api/admin/package-products', { method: 'POST', body: JSON.stringify(body) });
}

export async function patchAdminPackageProduct(
  code: string,
  body: {
    name?: string;
    amount?: number;
    shortDescription?: string;
    detailHelp?: string;
    features?: string[];
    sortOrder?: number;
    isActive?: boolean;
  }
): Promise<ApiSuccess<AdminPackageProductRow>> {
  return apiFetch(`/api/admin/package-products/${encodeURIComponent(code)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export type AdminUserActivePackageRow = {
  publicId?: string;
  amount: number;
  planCode?: string;
  planName?: string;
  status?: string;
};

export type AdminUserRow = {
  id: string;
  userCode?: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  /** True if the user has ever bought at least one package (any subscription record). */
  hasPurchasedPackage?: boolean;
  /** Subscriptions with status `active` (principal + plan shown for admin). */
  activePackages?: AdminUserActivePackageRow[];
};

export async function getAdminUsers(params?: {
  page?: number;
  limit?: number;
  q?: string;
  role?: string;
  /** Account can log in when true; blocked when false. */
  isActive?: boolean;
  /** Filter by whether the user has ever purchased a package. */
  hasPurchasedPackage?: boolean;
}): Promise<ApiSuccess<AdminUserRow[]> & { meta: PaginatedMeta }> {
  const q = new URLSearchParams({
    page: String(params?.page || 1),
    limit: String(params?.limit || 20),
  });
  if (params?.q?.trim()) q.set('q', params.q.trim());
  if (params?.role?.trim()) q.set('role', params.role.trim());
  if (typeof params?.isActive === 'boolean') q.set('isActive', String(params.isActive));
  if (typeof params?.hasPurchasedPackage === 'boolean') q.set('hasPurchasedPackage', String(params.hasPurchasedPackage));
  return apiFetch(`/api/admin/users?${q}`);
}

export type AdminUserPasswordRow = {
  userCode: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  password: string | null;
  hasPasswordOnFile: boolean;
};

export async function getAdminUserPasswordsList(params?: {
  page?: number;
  limit?: number;
  q?: string;
  role?: string;
  isActive?: boolean;
}): Promise<ApiSuccess<AdminUserPasswordRow[]> & { meta: PaginatedMeta }> {
  const q = new URLSearchParams({
    page: String(params?.page || 1),
    limit: String(params?.limit || 20),
  });
  if (params?.q?.trim()) q.set('q', params.q.trim());
  if (params?.role?.trim()) q.set('role', params.role.trim());
  if (typeof params?.isActive === 'boolean') q.set('isActive', String(params.isActive));
  return apiFetch(`/api/admin/user-passwords?${q}`);
}

export type AdminUserDetailDto = {
  user: AdminUserRow & { referralCode?: string; preferredCommunity?: string };
  wallet?: { balance: number; eligibleToWithdraw: number; updatedAt?: string };
  fundStats?: Array<{ id?: string; count: number }>;
  withdrawalStats?: Array<{ id?: string; count: number; amount?: number }>;
};

export async function getAdminUserDetail(userCode: string): Promise<ApiSuccess<AdminUserDetailDto>> {
  return apiFetch(`/api/admin/users/${encodeURIComponent(userCode)}`);
}

export async function patchAdminUserStatus(userCode: string, isActive: boolean): Promise<ApiSuccess<AdminUserRow>> {
  return apiFetch(`/api/admin/users/${encodeURIComponent(userCode)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
}

export async function getAdminUserLookup(
  userCode: string
): Promise<ApiSuccess<{ userCode: string; name: string; isActive: boolean }>> {
  return apiFetch(`/api/admin/users/lookup/${encodeURIComponent(userCode)}`);
}

export async function postAdminCreditUser(
  userCode: string,
  body: { amount: number; note?: string }
): Promise<ApiSuccess<Record<string, unknown>>> {
  return apiFetch(`/api/admin/users/${encodeURIComponent(userCode)}/credit`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function postAdminPurchaseForUser(
  userCode: string,
  body: { planCode: string; packageCode: string }
): Promise<ApiSuccess<Record<string, unknown>>> {
  return apiFetch(`/api/admin/users/${encodeURIComponent(userCode)}/purchase`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getAdminUserPassword(userCode: string): Promise<ApiSuccess<{ password: string | null }>> {
  return apiFetch(`/api/admin/users/${encodeURIComponent(userCode)}/password`);
}

export type CommunityMemberRow = {
  memberUserCode: string;
  memberName: string;
  memberEmail: string;
  memberIsActive: boolean;
  joinedAt?: string;
  sponsorName: string;
  sponsorUserCode: string;
  community: string;
  side: string;
  level?: number;
};

export async function getAdminCommunityUsers(params: {
  community: 'left' | 'right';
  page?: number;
  limit?: number;
  q?: string;
}): Promise<ApiSuccess<CommunityMemberRow[]> & { meta: PaginatedMeta }> {
  const q = new URLSearchParams({
    community: params.community,
    page: String(params.page || 1),
    limit: String(params.limit || 20),
  });
  if (params.q?.trim()) q.set('q', params.q.trim());
  return apiFetch(`/api/admin/community-users?${q}`);
}

export type AdminCommunityTotalsDto = {
  left: { users: number; investment: number };
  right: { users: number; investment: number };
};

export async function getAdminCommunityTotals(): Promise<ApiSuccess<AdminCommunityTotalsDto>> {
  return apiFetch('/api/admin/community-totals');
}

export async function getAdminUserTeamTree(
  rootUserCode: string,
  depth = 6,
  nodes = 500
): Promise<ApiSuccess<TeamTreeDto>> {
  const q = new URLSearchParams({ depth: String(depth), nodes: String(nodes) });
  return apiFetch(`/api/admin/users/${encodeURIComponent(rootUserCode)}/team/tree?${q}`);
}

export async function getAdminUserTeamTreeChildren(
  rootUserCode: string,
  parentUserCode: string,
  limit = 120
): Promise<ApiSuccess<{ parentUserCode: string; data: TeamTreeNode[] }>> {
  const q = new URLSearchParams({ parentUserCode, limit: String(limit) });
  return apiFetch(`/api/admin/users/${encodeURIComponent(rootUserCode)}/team/tree/children?${q}`);
}

export async function getAdminUserTeamFocus(
  rootUserCode: string,
  targetUserCode?: string
): Promise<ApiSuccess<TeamFocusWindowDto>> {
  const q = new URLSearchParams();
  if (targetUserCode?.trim()) q.set('targetUserCode', targetUserCode.trim().toUpperCase());
  const suffix = q.toString() ? `?${q}` : '';
  return apiFetch(`/api/admin/users/${encodeURIComponent(rootUserCode)}/team/tree/focus${suffix}`);
}

export type AdminAuditLogRow = {
  id: string;
  action: string;
  targetType: string;
  details?: Record<string, unknown>;
  createdAt?: string;
  actorUserId?: { id?: string; userCode?: string; name?: string; email?: string };
};

export async function getAdminAuditLogs(params?: {
  page?: number;
  limit?: number;
  action?: string;
  targetType?: string;
  actorUserCode?: string;
  from?: string;
  to?: string;
}): Promise<ApiSuccess<AdminAuditLogRow[]> & { meta: PaginatedMeta }> {
  const q = new URLSearchParams({
    page: String(params?.page || 1),
    limit: String(params?.limit || 20),
  });
  if (params?.action?.trim()) q.set('action', params.action.trim());
  if (params?.targetType?.trim()) q.set('targetType', params.targetType.trim());
  if (params?.actorUserCode?.trim()) q.set('actorUserCode', params.actorUserCode.trim().toUpperCase());
  if (params?.from?.trim()) q.set('from', params.from.trim());
  if (params?.to?.trim()) q.set('to', params.to.trim());
  return apiFetch(`/api/admin/audit-logs?${q}`);
}

export type HolidayRow = {
  id: string;
  exchange: string;
  dateIst: string;
  reason?: string;
};

export type PaginatedHolidays = {
  success: boolean;
  data: HolidayRow[];
  meta: PaginatedMeta;
};

export async function getAdminHolidays(page = 1, limit = 20): Promise<PaginatedHolidays> {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  return apiFetch(`/api/holidays?${q}`);
}

export async function postAdminHoliday(body: {
  dateIst: string;
  reason?: string;
  exchange?: string;
}): Promise<ApiSuccess<HolidayRow>> {
  return apiFetch('/api/holidays', { method: 'POST', body: JSON.stringify(body) });
}

export async function deleteAdminHoliday(dateIst: string): Promise<ApiSuccess<HolidayRow>> {
  return apiFetch(`/api/holidays/${encodeURIComponent(dateIst)}`, { method: 'DELETE' });
}

export type LedgerRow = {
  id: string;
  amount: number;
  direction: 'credit' | 'debit';
  contextType: string;
  notes?: string;
  createdAt?: string;
  packageSubscriptionId?: string | null;
};

export type PaginatedLedger = {
  success: boolean;
  data: LedgerRow[];
  meta: PaginatedMeta;
};

export async function getWalletLedger(page = 1, limit = 20): Promise<PaginatedLedger> {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  return apiFetch(`/api/wallet/ledger?${q}`);
}

export type WithdrawalRow = {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewReason?: string;
  bankSnapshot?: {
    accountHolderName?: string;
    bankName?: string;
    accountLast4?: string;
    ifscCode?: string;
    upiId?: string;
  };
  createdAt?: string;
  userId?: string | { id?: string; name?: string; email?: string; userCode?: string };
};

export type PaginatedWithdrawals = {
  success: boolean;
  data: WithdrawalRow[];
  meta: PaginatedMeta;
};

export type WithdrawalStatusFilter = '' | 'pending' | 'approved' | 'rejected';

export async function getMyWithdrawals(
  page = 1,
  limit = 20,
  status?: WithdrawalStatusFilter
): Promise<PaginatedWithdrawals> {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) q.set('status', status);
  return apiFetch(`/api/withdrawals/me?${q}`);
}

export async function getAdminWithdrawals(
  page = 1,
  limit = 20,
  status?: WithdrawalStatusFilter,
  filters?: { q?: string; from?: string; to?: string }
): Promise<PaginatedWithdrawals> {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) q.set('status', status);
  if (filters?.q?.trim()) q.set('q', filters.q.trim());
  if (filters?.from?.trim()) q.set('from', filters.from.trim());
  if (filters?.to?.trim()) q.set('to', filters.to.trim());
  return apiFetch(`/api/withdrawals/admin?${q}`);
}

export async function getMyWithdrawalSummary(): Promise<ApiSuccess<{ approvedTotal: number }>> {
  return apiFetch('/api/withdrawals/me/summary');
}

export type BankAccountDto = {
  accountHolderName: string;
  bankName: string;
  accountNumberMasked: string;
  ifscCode: string;
  upiId?: string;
  updatedAtUtc?: string | null;
  isComplete: boolean;
};

export async function getMyBankAccount(): Promise<ApiSuccess<BankAccountDto>> {
  return apiFetch('/api/bank-account/me');
}

export async function putMyBankAccount(body: {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId?: string;
}): Promise<ApiSuccess<BankAccountDto>> {
  return apiFetch('/api/bank-account/me', {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function postWithdrawalRequest(body: { amount: number }): Promise<ApiSuccess<WithdrawalRow>> {
  return apiFetch('/api/withdrawals', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export type FundTransferRow = {
  id: string;
  fromUserCode: string;
  toUserCode: string;
  amount: number;
  note?: string;
  status?: string;
  createdAt?: string;
};

export type FundTransferType = 'all' | 'sent' | 'received';

export async function postFundTransferToUser(body: {
  toUserCode: string;
  amount: number;
  note?: string;
}): Promise<ApiSuccess<FundTransferRow>> {
  return apiFetch('/api/fund-transfers/user', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getMyFundTransfers(
  page = 1,
  limit = 20,
  type: FundTransferType = 'all',
  filters?: { q?: string; from?: string; to?: string }
): Promise<ApiSuccess<FundTransferRow[]> & { meta: PaginatedMeta }> {
  const q = new URLSearchParams({ page: String(page), limit: String(limit), type });
  if (filters?.q?.trim()) q.set('q', filters.q.trim());
  if (filters?.from?.trim()) q.set('from', filters.from.trim());
  if (filters?.to?.trim()) q.set('to', filters.to.trim());
  return apiFetch(`/api/fund-transfers/me?${q}`);
}

export type PlanRow = {
  id: string;
  code: string;
  name: string;
  dailyPercent: number;
  cycleDaysW: number;
  maxWorkingDaysN: number;
  sponsorPercent?: number;
  summary?: string;
  detailHelp?: string;
};

export async function getPlans(): Promise<ApiSuccess<PlanRow[]>> {
  return apiFetch('/api/plans');
}

export type PackageProductRow = {
  id: string;
  code: string;
  name: string;
  amount: number;
  shortDescription?: string;
  detailHelp?: string;
  features?: string[];
  sortOrder?: number;
};

export async function getPackageProducts(): Promise<ApiSuccess<PackageProductRow[]>> {
  return apiFetch('/api/package-products');
}

export async function postPackagePurchase(body: {
  planCode: string;
  packageCode: string;
}): Promise<ApiSuccess<Record<string, unknown>>> {
  return apiFetch('/api/packages/purchase', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export type TradeCreditRow = {
  amount: number;
  creditDateIst?: string;
  createdAt?: string;
};

export type SponsorIncomeRow = { creditedAmount: number; createdAt?: string };

export type MatchingIncomeRow = {
  amount?: number;
  creditedAmount?: number;
  payoutCreditedAmount?: number;
  status?: 'credited' | 'skipped' | 'duplicate';
  createdAt?: string;
  creditDateIst?: string;
};

export async function getIncomeTrade(): Promise<ApiSuccess<TradeCreditRow[]>> {
  return apiFetch('/api/income/trade');
}

export async function getIncomeSponsor(): Promise<ApiSuccess<SponsorIncomeRow[]>> {
  return apiFetch('/api/income/sponsor');
}

export async function getIncomeMatching(): Promise<ApiSuccess<MatchingIncomeRow[]>> {
  return apiFetch('/api/income/matching');
}

/** Subscription from GET /api/packages/me (planId populated). */
export type PackageSubscriptionPlan = {
  code?: string;
  name?: string;
  dailyPercent?: number;
  cycleDaysW?: number;
  maxWorkingDaysN?: number;
  summary?: string;
};

export type PackageRow = {
  id?: string;
  _id?: string;
  publicId?: string;
  principalAmount: number;
  status: string;
  purchaseDateIst?: string;
  firstEarningDateIst?: string;
  withdrawalDay1Ist?: string;
  workingDaysCredited?: number;
  planId?: PackageSubscriptionPlan | string;
  createdAt?: string;
};

export async function getMyPackages(): Promise<ApiSuccess<PackageRow[]>> {
  return apiFetch('/api/packages/me');
}

export type TreeApiResponse = {
  myNode: {
    userId?: string;
    side?: string;
    community?: string;
    level?: number;
    parentUserId?: string | null;
  } | null;
  downline: Array<{
    userId?: string;
    side?: string;
    community?: string;
    level?: number;
    parentUserId?: string | null;
  }>;
  meta?: PaginatedMeta;
};

export async function getNetworkTree(page = 1, limit = 50): Promise<ApiSuccess<TreeApiResponse>> {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  return apiFetch(`/api/network/tree?${q}`);
}

export type TeamSummaryDto = {
  totalMembers: number;
  directMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  maxLevel: number;
  leftCommunityMembers: number;
  rightCommunityMembers: number;
  myLeftMembers: number;
  myRightMembers: number;
  myLeftInvestment: number;
  myRightInvestment: number;
};

export type TeamMemberRow = {
  userId?: string;
  parentUserId?: string | null;
  level: number;
  side: "left" | "right";
  community: "left" | "right";
  createdAt?: string;
  memberName: string;
  memberEmail: string;
  memberUserCode: string;
  memberIsActive: boolean;
  joinedAt?: string;
  sponsorName: string;
  sponsorUserCode: string;
};

export type TeamTypeFilter = "all" | "direct";

export async function getMyTeamSummary(): Promise<ApiSuccess<TeamSummaryDto>> {
  return apiFetch("/api/network/team/summary");
}

export async function getMyTeamMembers(
  page = 1,
  limit = 20,
  filters?: { type?: TeamTypeFilter; q?: string; level?: number; community?: "left" | "right" }
): Promise<ApiSuccess<TeamMemberRow[]> & { meta: PaginatedMeta }> {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (filters?.type) query.set("type", filters.type);
  if (filters?.q?.trim()) query.set("q", filters.q.trim());
  if (filters?.community) query.set("community", filters.community);
  if (typeof filters?.level === "number" && Number.isFinite(filters.level) && filters.level > 0) {
    query.set("level", String(filters.level));
  }
  return apiFetch(`/api/network/team/members?${query}`);
}

export type TeamTreeNode = {
  memberUserCode: string;
  memberName: string;
  memberEmail: string;
  memberIsActive: boolean;
  sponsorUserCode?: string;
  sponsorName?: string;
  side: "left" | "right";
  community: "left" | "right";
  level: number;
  joinedAt?: string;
  directChildrenCount?: number;
};

export type TeamTreeLevel = {
  level: number;
  nodes: TeamTreeNode[];
};

export type TeamTreeDto = {
  root: TeamTreeNode | null;
  levels: TeamTreeLevel[];
  totalNodes: number;
  shownNodes: number;
  truncated: boolean;
  maxDepthApplied: number;
  maxNodesApplied: number;
};

export async function getMyTeamTree(
  depth = 6,
  nodes = 500
): Promise<ApiSuccess<TeamTreeDto>> {
  const q = new URLSearchParams({ depth: String(depth), nodes: String(nodes) });
  return apiFetch(`/api/network/team/tree?${q}`);
}

export async function getMyTeamTreeChildren(
  parentUserCode: string,
  limit = 120
): Promise<ApiSuccess<{ parentUserCode: string; data: TeamTreeNode[] }>> {
  const q = new URLSearchParams({ parentUserCode, limit: String(limit) });
  return apiFetch(`/api/network/team/tree/children?${q}`);
}

export type TeamFocusWindowDto = {
  parent: TeamTreeNode | null;
  focus: TeamTreeNode | null;
  children: TeamTreeNode[];
  grandchildrenByParent: Record<string, TeamTreeNode[]>;
  relation: "self" | "parent" | "descendant" | "admin_view";
};

export async function getMyTeamFocusWindow(
  userCode?: string
): Promise<ApiSuccess<TeamFocusWindowDto>> {
  const q = new URLSearchParams();
  if (userCode?.trim()) q.set("userCode", userCode.trim().toUpperCase());
  return apiFetch(`/api/network/team/tree/focus${q.toString() ? `?${q}` : ""}`);
}
