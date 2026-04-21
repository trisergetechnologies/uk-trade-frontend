"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, ChevronDown, ChevronRight } from "lucide-react";

/* ---------- TYPES ---------- */
type Rank = "Starter" | "Silver" | "Gold" | "Platinum" | "Diamond";

type Node = {
  id: number;
  name: string;
  rank: Rank;
  leftBV: number;
  rightBV: number;
  direct: number;
  children?: Node[];
};

/* ---------- SAMPLE DATA ---------- */
const treeData: Node = {
  id: 1,
  name: "You",
  rank: "Diamond",
  leftBV: 12000,
  rightBV: 9800,
  direct: 6,
  children: [
    {
      id: 2,
      name: "Rahul",
      rank: "Gold",
      leftBV: 4000,
      rightBV: 3500,
      direct: 3,
      children: [
        {
          id: 4,
          name: "Amit",
          rank: "Silver",
          leftBV: 1200,
          rightBV: 900,
          direct: 2,
        },
        {
          id: 5,
          name: "Neha",
          rank: "Starter",
          leftBV: 300,
          rightBV: 200,
          direct: 1,
        },
      ],
    },
    {
      id: 3,
      name: "Priya",
      rank: "Platinum",
      leftBV: 6000,
      rightBV: 5000,
      direct: 4,
    },
  ],
};

/* ---------- COLORS ---------- */
const rankColor: Record<Rank, string> = {
  Starter: "bg-gray-500",
  Silver: "bg-slate-300",
  Gold: "bg-yellow-400",
  Platinum: "bg-cyan-400",
  Diamond: "bg-indigo-500",
};

/* ---------- NODE CARD ---------- */
function NodeCard({
  node,
  expanded,
  toggle,
}: {
  node: Node;
  expanded: boolean;
  toggle: () => void;
}) {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.05 }}
      className="relative bg-[#0b0f1a] border border-white/10 rounded-xl p-4 w-[200px] shadow-xl"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <User size={14} />
          </div>
          <div>
            <p className="text-sm font-semibold">{node.name}</p>
            <p className="text-[10px] text-gray-400">ID {node.id}</p>
          </div>
        </div>

        {node.children && (
          <button onClick={toggle}>
            {expanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        )}
      </div>

      {/* RANK */}
      <div
        className={`mt-2 text-xs px-2 py-1 rounded inline-block ${rankColor[node.rank]}`}
      >
        {node.rank}
      </div>

      {/* STATS */}
      <div className="text-[11px] mt-2 text-gray-300 space-y-1">
        <p>BV: {node.leftBV + node.rightBV}</p>
        <p>Direct: {node.direct}</p>
      </div>
    </motion.div>
  );
}

/* ---------- TREE ---------- */
function TreeNode({ node }: { node: Node }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col items-center">
      <NodeCard
        node={node}
        expanded={open}
        toggle={() => setOpen(!open)}
      />

      {open && node.children && (
        <>
          {/* CONNECTOR */}
          <div className="w-px h-6 bg-white/20" />

          <div className="flex gap-10 relative">
            {/* HORIZONTAL LINE */}
            <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />

            {node.children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-6 bg-white/20" />
                <TreeNode node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- MAIN ---------- */
export default function MemberTree() {
  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 overflow-auto">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-indigo-400">
          MLM Network Tree
        </h1>
        <p className="text-gray-400 text-sm">
          Real-time binary structure
        </p>
      </div>

      {/* TREE WRAPPER (SCROLL + ZOOM READY) */}
      <div className="overflow-auto border border-white/10 rounded-xl p-6 bg-[#050816]">
        <div className="flex justify-center min-w-[800px]">
          <TreeNode node={treeData} />
        </div>
      </div>
    </div>
  );
}