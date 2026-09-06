import type { Commission, CommissionMember } from "@/lib/types";

function buildTree(commissions: Commission[]) {
  const byParent = new Map<string | null, Commission[]>();
  for (const c of commissions) {
    const key = c.parent_id ?? null;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(c);
  }
  return byParent;
}

function NodeCard({
  node,
  members,
}: {
  node: Commission;
  members: CommissionMember[];
}) {
  return (
    <div className="inline-flex max-w-sm flex-col rounded-lg border border-line bg-white px-4 py-3 shadow-sm">
      <p className="text-sm font-semibold text-primary-800">{node.name}</p>
      {node.description && (
        <p className="mt-1 text-xs leading-relaxed text-muted">
          {node.description}
        </p>
      )}
      {members.length > 0 && (
        <ul className="mt-3 space-y-2 border-t border-line pt-3">
          {members.map((m) => (
            <li key={m.id} className="flex items-center gap-2">
              {m.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.photo_url}
                  alt={m.name}
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-500">
                  {m.name
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0]?.toUpperCase())
                    .join("")}
                </span>
              )}
              <span className="text-xs font-medium text-ink">{m.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TreeLevel({
  nodes,
  byParent,
  membersByCommission,
  depth,
}: {
  nodes: Commission[];
  byParent: Map<string | null, Commission[]>;
  membersByCommission: Map<string, CommissionMember[]>;
  depth: number;
}) {
  return (
    <ul className={depth > 0 ? "ml-5 border-l border-primary-200 pl-5" : ""}>
      {nodes.map((node) => {
        const children = byParent.get(node.id) ?? [];
        const members = membersByCommission.get(node.id) ?? [];
        return (
          <li key={node.id} className="relative py-1.5">
            {depth > 0 && (
              <span className="absolute -left-5 top-[26px] h-px w-5 bg-primary-200" />
            )}
            <NodeCard node={node} members={members} />
            {children.length > 0 && (
              <div className="mt-1">
                <TreeLevel
                  nodes={children}
                  byParent={byParent}
                  membersByCommission={membersByCommission}
                  depth={depth + 1}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function OrgChart({
  commissions,
  members = [],
}: {
  commissions: Commission[];
  members?: CommissionMember[];
}) {
  if (!commissions.length) return null;
  const byParent = buildTree(commissions);
  const membersByCommission = new Map<string, CommissionMember[]>();
  for (const m of members) {
    if (!membersByCommission.has(m.commission_id)) {
      membersByCommission.set(m.commission_id, []);
    }
    membersByCommission.get(m.commission_id)!.push(m);
  }

  const roots = byParent.get(null) ?? [];

  if (!roots.length) {
    // Sin raíces explícitas, mostrar todo como lista plana
    return (
      <TreeLevel
        nodes={commissions}
        byParent={byParent}
        membersByCommission={membersByCommission}
        depth={0}
      />
    );
  }

  return (
    <TreeLevel
      nodes={roots}
      byParent={byParent}
      membersByCommission={membersByCommission}
      depth={0}
    />
  );
}
