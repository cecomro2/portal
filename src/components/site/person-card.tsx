import type { Person } from "@/lib/types";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function PersonCard({ person }: { person: Person }) {
  return (
    <div className="group overflow-hidden rounded-xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
        {person.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={person.photo_url}
            alt={person.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-5xl font-bold text-primary-300">
              {initials(person.name)}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-primary-800">
          {person.name}
        </h3>
        <p className="mt-1 text-sm text-muted">{person.position}</p>
      </div>
    </div>
  );
}
