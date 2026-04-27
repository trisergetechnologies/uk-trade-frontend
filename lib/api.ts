import { getToken } from '@/lib/session';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

export { getToken };

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
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

export type AuthUser = {
  id: string;
  userCode?: string;
  name: string;
  email: string;
  role: string;
  referralCode?: string;
  preferredCommunity?: string;
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
  referralCode: string;
  community: 'left' | 'right';
}): Promise<AuthResponse> {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
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
  screenshotUrl?: string;
  createdAt?: string;
  userId?: string | { id?: string; name?: string; email?: string; userCode?: string };
};

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

export async function getAdminFundRequests(page = 1, limit = 20): Promise<PaginatedFundRequests> {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
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
  status?: WithdrawalStatusFilter
): Promise<PaginatedWithdrawals> {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) q.set('status', status);
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

/** Row shape TBD when matching is implemented; supports optional amount + date. */
export type MatchingIncomeRow = { amount?: number; createdAt?: string; creditDateIst?: string };

export async function getIncomeTrade(): Promise<ApiSuccess<TradeCreditRow[]>> {
  return apiFetch('/api/income/trade');
}

export async function getIncomeSponsor(): Promise<ApiSuccess<SponsorIncomeRow[]>> {
  return apiFetch('/api/income/sponsor');
}

export async function getIncomeMatching(): Promise<ApiSuccess<MatchingIncomeRow[]>> {
  return apiFetch('/api/income/matching');
}

export type PackageRow = {
  id: string;
  principalAmount: number;
  status: string;
  planId?: { code?: string; name?: string };
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
  filters?: { type?: TeamTypeFilter; q?: string; level?: number }
): Promise<ApiSuccess<TeamMemberRow[]> & { meta: PaginatedMeta }> {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (filters?.type) query.set("type", filters.type);
  if (filters?.q?.trim()) query.set("q", filters.q.trim());
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
  relation: "self" | "parent" | "descendant";
};

export async function getMyTeamFocusWindow(
  userCode?: string
): Promise<ApiSuccess<TeamFocusWindowDto>> {
  const q = new URLSearchParams();
  if (userCode?.trim()) q.set("userCode", userCode.trim().toUpperCase());
  return apiFetch(`/api/network/team/tree/focus${q.toString() ? `?${q}` : ""}`);
}
