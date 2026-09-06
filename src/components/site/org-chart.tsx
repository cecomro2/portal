import type { Commission } from "@/lib/types";

function buildTree(commissions: Commission[]) {
  const byParent = new Map<string | null, Commission[]>();
  for (const c of commissions) {
    const key = c.parent_id ?? null;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(c);
  }
  return byParent;
}

function NodeCard({ node }: { node: Commission }) {
  return (
    <div className="inline-flex max-w-sm flex-col rounded-lg border border-line bg-white px-4 py-3 shadow-sm">
      <p className="text-sm font-semibold text-primary-800">{node.name}</p>
      {node.description && (
        <p className="mt-1 text-xs leading-relaxed text-muted">
          {node.description}
        </p>
      )}
    </div>
  );
}

function TreeLevel({
  nodes,
  byParent,
  depth,
}: {
  nodes: Commission[];
  byParent: Map<string | null, Commission[]>;
  depth: number;
}) {
  return (
    <ul className={depth > 0 ? "ml-5 border-l border-primary-200 pl-5" : ""}>
      {nodes.map((node) => {
        const children = byParent.get(node.id) ?? [];
        return (
          <li key={node.id} className="relative py-1.5">
            {depth > 0 && (
              <span className="absolute -left-5 top-[26px] h-px w-5 bg-primary-200" />
            )}
            <NodeCard node={node} />
            {children.length > 0 && (
              <div className="mt-1">
                <TreeLevel nodes={children} byParent={byParent} depth={depth + 1} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function OrgChart({ commissions }: { commissions: Commission[] }) {
  if (!commissions.length) return null;
  const byParent = buildTree(commissions);
  const roots = byParent.get(null) ?? [];

  if (!roots.length) {
    // Sin raíces explícitas, mostrar todo como lista plana
    return (
      <TreeLevel nodes={commissions} byParent={byParent} depth={0} />
    );
  }

  return <TreeLevel nodes={roots} byParent={byParent} depth={0} />;
}
