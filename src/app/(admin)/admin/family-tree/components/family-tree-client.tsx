"use client"

import { useState, useMemo } from "react"
import { Search, Users, GitBranch, ChevronRight, Phone, Droplets, Briefcase, Info, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"

// ── Types ─────────────────────────────────────────────────────────────────────

type Member = {
  id: string
  memberId: string
  fullName: string | null
  firstName: string | null
  middleName: string | null
  surname: string | null
  gender: string
  dob: Date | null
  phone: string | null
  bloodGroup: string | null
  occupationRole: string | null
  isActive: boolean
}

type Family = {
  id: string
  familyId: string
  familyName: string
  businessName: string | null
  kutchVatan: string | null
  currentCity: string | null
  members: Member[]
}

type TreeNode = {
  member: Member
  spouse: Member | null   // wife shown beside husband at same level
  children: TreeNode[]
  depth: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcAge(dob: Date | null): number | null {
  if (!dob) return null
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000))
}

function displayName(m: Member) {
  return [m.firstName, m.middleName, m.surname].filter(Boolean).join(" ") || m.fullName || "Unknown"
}

function initials(m: Member) {
  const name = displayName(m)
  const parts = name.trim().split(" ")
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase() || "?"
}

const COLORS = [
  "bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500",
  "bg-rose-500", "bg-cyan-500", "bg-indigo-500", "bg-orange-500",
  "bg-teal-500", "bg-pink-500",
]
function avatarBg(name: string) {
  const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  return COLORS[hash % COLORS.length]
}

// ── Tree builder ──────────────────────────────────────────────────────────────
// Rules:
//   1. For any member M, if another member P has firstName == M.middleName → potential parent/husband
//   2. If M is FEMALE and age diff with P ≤ 25 yrs → M is P's wife (spouse, same level)
//   3. Otherwise → M is P's child (one level below)
//   4. Unlinked female roots: eldest → wife of eldest male root; others by age proximity

function buildFamilyTree(members: Member[]): TreeNode[] {
  const byFirstName = new Map<string, Member>()
  for (const m of members) {
    if (m.firstName) byFirstName.set(m.firstName.trim().toLowerCase(), m)
  }

  const childrenOf = new Map<string, Member[]>()
  const hasParent = new Set<string>()
  const isSpouseOf = new Map<string, string>() // femaleId → husbandId

  // ── PASS 1: link members whose patriarch IS in the system ─────────────────
  for (const m of members) {
    if (!m.middleName) continue
    const potential = byFirstName.get(m.middleName.trim().toLowerCase())
    if (!potential || potential.id === m.id) continue

    const mAge = calcAge(m.dob)
    const pAge = calcAge(potential.dob)

    if (
      m.gender === "FEMALE" &&
      potential.gender === "MALE" &&
      mAge !== null && pAge !== null &&
      Math.abs(pAge - mAge) <= 25
    ) {
      // Close in age → wife
      isSpouseOf.set(m.id, potential.id)
    } else {
      // Child
      hasParent.add(m.id)
      if (!childrenOf.has(potential.id)) childrenOf.set(potential.id, [])
      childrenOf.get(potential.id)!.push(m)
    }
  }

  // ── PASS 2: absent patriarch — if a middle name doesn't exist as any member's
  //   firstName, the ELDEST female sharing that middle name becomes the mother.
  //   ALL other members with that same middle name are placed under her as children,
  //   regardless of age difference.
  const orphanGroups = new Map<string, Member[]>()
  for (const m of members) {
    if (!m.middleName) continue
    const key = m.middleName.trim().toLowerCase()
    if (byFirstName.has(key)) continue           // patriarch exists — pass 1 handled it
    if (hasParent.has(m.id) || isSpouseOf.has(m.id)) continue
    if (!orphanGroups.has(key)) orphanGroups.set(key, [])
    orphanGroups.get(key)!.push(m)
  }

  for (const [, group] of orphanGroups) {
    if (group.length < 2) continue              // lone female stays as root; nothing to group

    // Eldest female in the group → becomes the sole mother
    const matriarch = group
      .filter(m => m.gender === "FEMALE")
      .sort((a, b) => (calcAge(b.dob) ?? 0) - (calcAge(a.dob) ?? 0))[0]

    if (!matriarch) continue                    // no female in group — cannot determine mother

    // ALL others with the same absent middle name go under her, unconditionally
    for (const m of group) {
      if (m.id === matriarch.id) continue
      hasParent.add(m.id)
      if (!childrenOf.has(matriarch.id)) childrenOf.set(matriarch.id, [])
      childrenOf.get(matriarch.id)!.push(m)
    }
  }

  // ── PASS 3: pair any remaining unlinked female roots with unpaired male roots
  const malesWithSpouse = new Set(isSpouseOf.values())
  const unpairedMaleRoots = members
    .filter(m => m.gender === "MALE" && !hasParent.has(m.id) && !malesWithSpouse.has(m.id))
    .sort((a, b) => (calcAge(b.dob) ?? 0) - (calcAge(a.dob) ?? 0))

  const unlinkFemaleRoots = members
    .filter(m => m.gender === "FEMALE" && !hasParent.has(m.id) && !isSpouseOf.has(m.id))
    .sort((a, b) => (calcAge(b.dob) ?? 0) - (calcAge(a.dob) ?? 0))

  for (let i = 0; i < unlinkFemaleRoots.length && i < unpairedMaleRoots.length; i++) {
    isSpouseOf.set(unlinkFemaleRoots[i].id, unpairedMaleRoots[i].id)
  }

  // ── Build recursive nodes ──────────────────────────────────────────────────
  function buildNode(member: Member, depth: number): TreeNode {
    const spouse = members.find(m => isSpouseOf.get(m.id) === member.id) ?? null
    const ownKids = childrenOf.get(member.id) ?? []
    const spouseKids = spouse ? (childrenOf.get(spouse.id) ?? []) : []
    const allKids = [...new Map([...ownKids, ...spouseKids].map(k => [k.id, k])).values()]
      .sort((a, b) => (calcAge(b.dob) ?? 0) - (calcAge(a.dob) ?? 0))
    return { member, spouse, depth, children: allKids.map(c => buildNode(c, depth + 1)) }
  }

  const roots = members
    .filter(m => !hasParent.has(m.id) && !isSpouseOf.has(m.id))
    .sort((a, b) => (calcAge(b.dob) ?? 0) - (calcAge(a.dob) ?? 0))

  return roots.map(r => buildNode(r, 0))
}

// ── Member Card ───────────────────────────────────────────────────────────────

function MemberCard({ member, depth, isSpouse = false }: { member: Member; depth: number; isSpouse?: boolean }) {
  const bg = avatarBg(displayName(member))
  const memberAge = calcAge(member.dob)
  const isMale = member.gender === "MALE"
  const avatarSize = depth === 0 ? "w-14 h-14 text-lg" : "w-12 h-12 text-base"

  return (
    <div className="flex flex-col items-center w-36 group">
      {/* Avatar */}
      <div className="relative">
        <div className={`${avatarSize} rounded-full ${bg} flex items-center justify-center font-bold text-white shadow-lg ring-4 ring-background group-hover:ring-primary/40 transition-all`}>
          {initials(member)}
        </div>
        <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shadow border-2 border-background ${
          isMale ? "bg-blue-500 text-white" : "bg-pink-500 text-white"
        }`}>
          {isMale ? "M" : "F"}
        </span>
        {member.isActive && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background" />
        )}
      </div>

      {/* Info */}
      <div className="mt-2 w-full rounded-2xl bg-card border border-border/60 shadow-sm p-2.5 text-center group-hover:border-primary/30 transition-all">
        <p className="text-xs font-bold text-foreground leading-tight truncate" title={displayName(member)}>
          {displayName(member)}
        </p>
        <p className="text-[9px] text-muted-foreground font-mono mt-0.5">{member.memberId}</p>
        {member.middleName && (
          <p className="text-[9px] text-primary/70 mt-0.5 truncate">
            {member.gender === "FEMALE"
              ? (isSpouse || depth === 0) ? "w/o" : "d/o"
              : "s/o"} {member.middleName}
          </p>
        )}
        <div className="mt-1.5 space-y-0.5">
          {memberAge !== null && (
            <p className="text-[9px] text-muted-foreground">{memberAge} yrs</p>
          )}
          {member.phone && (
            <div className="flex items-center justify-center gap-0.5 text-[9px] text-muted-foreground">
              <Phone className="w-2 h-2" /><span className="truncate">{member.phone}</span>
            </div>
          )}
          {member.bloodGroup && (
            <div className="flex items-center justify-center gap-0.5 text-[9px] text-primary font-semibold">
              <Droplets className="w-2 h-2" /><span>{member.bloodGroup}</span>
            </div>
          )}
          {member.occupationRole && (
            <div className="flex items-center justify-center gap-0.5 text-[9px] text-muted-foreground">
              <Briefcase className="w-2 h-2" /><span className="truncate">{member.occupationRole}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Couple unit (husband + wife side by side) ─────────────────────────────────

function CoupleUnit({ node }: { node: TreeNode }) {
  return (
    <div className="flex flex-col items-center">
      {/* Husband + wife row — oldest child (eldest) on left */}
      <div className="flex items-start gap-2">
        <MemberCard member={node.member} depth={node.depth} />
        {node.spouse && (
          <>
            <div className="flex items-center self-center mt-[-16px] px-1">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            </div>
            <MemberCard member={node.spouse} depth={node.depth} isSpouse={true} />
          </>
        )}
      </div>

      {/* Stem down to children */}
      {node.children.length > 0 && (
        <>
          <div className="w-0.5 h-10 bg-primary/50 mt-1" />
          <ChildrenRow nodes={node.children} />
        </>
      )}
    </div>
  )
}

// ── Row of sibling nodes ──────────────────────────────────────────────────────
// Children are ordered oldest → youngest (left → right).
// Branch lines use the "half-line per node" technique:
// each node draws left-half toward its left sibling and right-half toward its
// right sibling.  With no flex gap between nodes the half-lines meet exactly.

function ChildrenRow({ nodes }: { nodes: TreeNode[] }) {
  if (nodes.length === 0) return null

  // Sort oldest first (left side) — also applied in buildNode, but re-apply here
  // for safety so the visual always matches.
  const sorted = [...nodes].sort(
    (a, b) => (calcAge(b.member.dob) ?? 0) - (calcAge(a.member.dob) ?? 0)
  )

  return (
    // No gap — adjacent divs must be flush so half-lines connect without a gap
    <div className="flex items-start justify-center">
      {sorted.map((node, idx) => {
        const isFirst = idx === 0
        const isLast  = idx === sorted.length - 1
        const isOnly  = sorted.length === 1

        return (
          <div
            key={node.member.id}
            // relative so the absolute connector can fill inset-x-0 (outer edges)
            className="relative flex flex-col items-center px-6"
          >
            {/* ── Branch connector ─────────────────────────────────────── */}
            {isOnly ? (
              // Single child: straight vertical line
              <div className="h-10 w-0.5 bg-primary/50" />
            ) : (
              <>
                {/*
                  absolute + inset-x-0 makes it span the FULL width of this div
                  including the px-6 padding, so its left-0/right-0 reach the
                  outer edges. Adjacent nodes' half-lines then meet exactly.
                */}
                <div className="absolute top-0 inset-x-0 h-10 pointer-events-none">
                  {/* Left half → toward left sibling */}
                  {!isFirst && (
                    <div className="absolute top-0 left-0 right-1/2 h-0.5 bg-primary/50" />
                  )}
                  {/* Right half → toward right sibling */}
                  {!isLast && (
                    <div className="absolute top-0 left-1/2 right-0 h-0.5 bg-primary/50" />
                  )}
                  {/* Vertical drop from the horizontal bar down to the card */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-px w-0.5 bg-gradient-to-b from-primary/60 to-primary/20" />
                </div>
                {/* Spacer so CoupleUnit clears the absolute connector */}
                <div className="h-10" />
              </>
            )}

            <CoupleUnit node={node} />
          </div>
        )
      })}
    </div>
  )
}

// ── Full family tree view ─────────────────────────────────────────────────────

function FamilyTreeView({ family }: { family: Family }) {
  const treeRoots = useMemo(() => buildFamilyTree(family.members), [family.members])

  const linkedIds = useMemo(() => {
    const ids = new Set<string>()
    function collect(nodes: TreeNode[]) {
      for (const n of nodes) {
        ids.add(n.member.id)
        if (n.spouse) ids.add(n.spouse.id)
        collect(n.children)
      }
    }
    collect(treeRoots)
    return ids
  }, [treeRoots, family.members])

  const unlinked = family.members.filter(m => !linkedIds.has(m.id))

  return (
    <div className="flex flex-col items-center w-full gap-8">
      {/* Family root card */}
      <div className="flex items-center gap-4 px-8 py-5 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/40 shadow-xl shadow-primary/10 max-w-xl">
        <div className="w-14 h-14 rounded-2xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center shrink-0">
          <Users className="w-7 h-7 text-primary" />
        </div>
        <div className="text-left min-w-0">
          <h3 className="text-lg font-bold text-foreground">{family.familyName}</h3>
          {family.businessName && <p className="text-sm text-muted-foreground">{family.businessName}</p>}
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="text-xs font-mono text-primary">{family.familyId}</span>
            {family.currentCity && <span className="text-xs text-muted-foreground">📍 {family.currentCity}</span>}
            {family.kutchVatan && <span className="text-xs text-muted-foreground">🏡 {family.kutchVatan}</span>}
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
              {family.members.length} member{family.members.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Stem from family root */}
      {treeRoots.length > 0 && (
        <div className="w-0.5 h-8 -my-4 bg-gradient-to-b from-primary/60 to-primary/20" />
      )}

      {/* Tree */}
      {family.members.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No members in this family</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <div className="min-w-max mx-auto px-8">
            <ChildrenRow nodes={treeRoots} />
          </div>
        </div>
      )}

      {/* Unlinked members */}
      {unlinked.length > 0 && (
        <div className="w-full border border-dashed border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
            <Info className="w-3.5 h-3.5" />
            Members not yet linked in tree — add middle name to connect them
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {unlinked.map(m => (
              <MemberCard key={m.id} member={m} depth={1} />
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-muted-foreground pt-2 border-t border-border w-full justify-center flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white font-bold">M</span>
          Male
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center text-[8px] text-white font-bold">F</span>
          Female
        </div>
        <div className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          Spouse pair
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          Active member
        </div>
        <span className="text-primary/70 italic">w/o = wife of · d/o = daughter of · s/o = son of</span>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function FamilyTreeClient({ families }: { families: Family[] }) {
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string>(families[0]?.id ?? "")

  const filtered = useMemo(() =>
    families.filter(f =>
      f.familyName.toLowerCase().includes(search.toLowerCase()) ||
      (f.businessName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (f.currentCity ?? "").toLowerCase().includes(search.toLowerCase())
    ),
    [families, search]
  )

  const selectedFamily = families.find(f => f.id === selectedId) ?? families[0]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground flex items-center gap-3">
          <GitBranch className="w-7 h-7 text-primary" />
          Family Tree
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Hierarchy derived from middle name (father&apos;s / husband&apos;s name). Spouses shown side by side.
        </p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-220px)]">
        {/* Left: family list */}
        <div className="w-72 shrink-0 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search families..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-background/50 border-border/50"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filtered.map(family => {
              const isSelected = family.id === selectedId
              return (
                <button
                  key={family.id}
                  onClick={() => setSelectedId(family.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all border ${
                    isSelected
                      ? "bg-primary/10 border-primary/30 shadow-sm shadow-primary/10"
                      : "bg-card border-border/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {family.familyName}
                      </p>
                      {family.businessName && (
                        <p className="text-xs text-muted-foreground truncate">{family.businessName}</p>
                      )}
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{family.familyId}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        {family.members.length}
                      </span>
                      {isSelected && <ChevronRight className="w-3.5 h-3.5 text-primary" />}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
            {filtered.length} of {families.length} families
          </p>
        </div>

        {/* Right: tree */}
        <div className="flex-1 overflow-auto rounded-2xl border border-border bg-card/30 backdrop-blur-sm p-8">
          {selectedFamily
            ? <FamilyTreeView family={selectedFamily} />
            : <div className="flex items-center justify-center h-full text-muted-foreground">Select a family</div>
          }
        </div>
      </div>
    </div>
  )
}
