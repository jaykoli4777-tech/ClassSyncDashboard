import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  CalendarClock,
  NotebookPen,
  ClipboardList,
  CheckSquare,
  Megaphone,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  MapPin,
  User2,
  ArrowUpRight,
  CircleDot,
  Ban,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  RotateCcw,
  CheckCircle2,
  CalendarDays,
  Info,
  Bookmark,
  Download,
  Eye,
  ExternalLink,
  Trash2,
  AlertTriangle,
  GraduationCap,
  BookOpen,
  Camera,
  SlidersHorizontal,
  Pin,
  SlidersVertical,
  Zap,
  Database,
  CalendarRange,
} from "lucide-react";

/* ============================================================
   DESIGN TOKENS
   (In a multi-file build this would live in styles/tokens.css)
   ============================================================ */
const Tokens = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

    .cs-root {
      --ink: #1B2740;
      --ink-soft: #2C3A57;
      --paper: #F8F6F0;
      --panel: #FFFFFF;
      --line: #E5E1D6;
      --gold: #C6972F;
      --gold-tint: #FBF1DC;
      --gold-tint-line: #EBD9A8;
      --slate: #6B7280;
      --slate-dim: #97998f;
      --good: #3F7D58;
      --good-tint: #E9F3EC;
      --warn: #B8542F;
      --warn-tint: #FBEAE2;
      --resched: #A9800E;
      --resched-tint: #FBF3D9;
      --extra: #6E5DA6;
      --extra-tint: #EFEBF8;
      --info: #3E6FA5;
      --info-tint: #E9EFF6;
      --due-today: #C2650C;
      --due-today-tint: #FBEEDF;
      --text: #232B3D;
      font-family: 'IBM Plex Sans', -apple-system, sans-serif;
      background: var(--paper);
      color: var(--text);
    }
    .cs-serif { font-family: 'Source Serif 4', Georgia, serif; }
    .cs-card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 10px;
    }
    .cs-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
    .cs-scroll::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }
    .cs-input {
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 13px;
      padding: 8px 10px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--paper);
      color: var(--text);
      outline: none;
      width: 100%;
    }
    .cs-input:focus { border-color: var(--gold); }
  `}</style>
);

/* ================================================================
   ============  CENTRALIZED APP DATA / CONFIGURATION  =============
   ================================================================

   Personal, academic and class information is never hardcoded in
   the JSX. As of Step 9 every last piece of it is centralized,
   user-editable state owned by App() and shared down — there is no
   static `appData` object left at all.

   Where each thing lives now:
     profile / academic info  -> initialProfile      (below)
     subjects + their faculty -> initialSubjects     (below)
     preferences              -> initialPreferences  (below)
     timetable                -> scheduleDemoData    (Schedule section)
     notes & resources        -> resourcesDemoData   (Notes section)
     assignments              -> assignmentsDemoData (Assignments section)
     attendance records       -> attendanceRecordsDemoData (Attendance)
     announcements            -> announcementsDemoData (Announcements)
     notifications            -> initialNotifications (Notifications)

   Each of those is seeded with sample/demo data and edited through
   the UI. The Dashboard never holds its own copy of anything — it
   receives reshaped views via the deriveDashboard*() helpers, so no
   two pages can drift out of sync.

   In a multi-file build these would each move to their own file
   under data/, and later be swapped for API / Supabase calls. The
   shapes would stay the same.
   ================================================================ */

const initialProfile = {
  name: "Aditi Sharma",
  email: "aditi.sharma@example.edu",
  phone: "",
  photoUrl: null,
  college: "Sample Institute of Technology",
  program: "B.Tech · Computer Science",
  department: "Computer Science & Engineering",
  academicSession: "2026–27",
  year: "3rd Year",
  semester: "Semester 5",
  section: "CSE-B",
  roll: "CS21045",
};

const initialPreferences = {
  timeFormat: "12h", // "12h" | "24h"
  weekStart: "monday", // "monday" | "sunday"
  defaultCalendarView: "Week", // Schedule page's initial view
  reminderPreference: 15, // default offset in ReminderSelector
  remindersEnabled: true, // master switch for the in-app reminder toast
  requiredAttendance: 75, // drives every attendance calculation
  greeting: "", // "" = auto ("Good morning/afternoon/evening")
  showUpcomingAssignments: true,
  showAttendanceWarnings: true,
  showAnnouncements: true,
};

const initialSubjects = [
  { id: "sub-dsa", name: "Data Structures & Algorithms", code: "CS201", facultyId: "fac-nair", facultyName: "Dr. Nair", facultyEmail: "nair@example.edu", facultyNotes: "Office hours Tue/Thu 3–4 PM, Cabin 12.", room: "Room 204", credits: 4, active: true },
  { id: "sub-dbms", name: "Database Management Systems", code: "CS204", facultyId: "fac-iyer", facultyName: "Prof. Iyer", facultyEmail: "iyer@example.edu", facultyNotes: "", room: "Room 204", credits: 4, active: true },
  { id: "sub-cn", name: "Computer Networks", code: "CS206", facultyId: "fac-menon", facultyName: "Dr. Menon", facultyEmail: "menon@example.edu", facultyNotes: "Prefers email over in-person queries.", room: "Room 108", credits: 3, active: true },
  { id: "sub-os", name: "Operating Systems", code: "CS205", facultyId: "fac-kulkarni", facultyName: "Dr. Kulkarni", facultyEmail: "kulkarni@example.edu", facultyNotes: "", room: "Room 108", credits: 4, active: true },
  { id: "sub-se", name: "Software Engineering Lab", code: "CS252", facultyId: "fac-rao", facultyName: "Prof. Rao", facultyEmail: "rao@example.edu", facultyNotes: "", room: "Lab 3", credits: 2, active: true },
];

// Module-level mirrors of the `subjects` / `preferences` React state
// in App. This is what lets getSubjectName(), getFacultyName() and
// formatTime12() — called from deep inside pages that never receive
// these as props — stay correct when the user edits their subjects or
// preferences. They are ONLY written by the wrapper setters in App
// (setSubjects / setPreferences), right alongside the real setState.
let liveSubjects = [...initialSubjects];
let livePreferences = { ...initialPreferences };

// Subjects offered in pickers — inactive (e.g. finished last term)
// subjects are hidden from selection, but getSubjectName() below
// still resolves them, so historical classes, assignments, notes and
// attendance records never break.
const activeSubjects = () => liveSubjects.filter((s) => s.active !== false);

/* ------------------------------------------------------------
   Resolver helpers — join the normalized data above so
   components can read plain fields like cls.subject,
   cls.faculty and cls.room instead of chasing ids by hand.
   (In a multi-file build: data/resolvers.js)

   As of Step 8, subjects (and their faculty) are user-editable —
   these two helpers now read from `liveSubjects`, a module-level
   mirror of the shared `subjects` state kept in sync by App()
   (declared just above, with the other centralized data). That's what lets
   every existing page — Schedule, Notes, Assignments, Attendance,
   none of which receive `subjects` as a prop — automatically pick
   up a subject added, renamed, or removed in Subject Management,
   without threading a new prop through the whole component tree.
   ------------------------------------------------------------ */
const getSubjectName = (id) =>
  liveSubjects.find((s) => s.id === id)?.name ?? "Unknown subject";

// Faculty is stored per-subject now, not as a separate table — this
// still takes a facultyId (unchanged call sites everywhere else)
// but resolves it by finding the subject it belongs to.
const getFacultyName = (facultyId) =>
  liveSubjects.find((s) => s.facultyId === facultyId)?.facultyName ?? "Unknown faculty";

// NOTE: "today's schedule" and "next class" for the Dashboard are no
// longer static — they're derived inside App() from the same live
// `classes` state the Schedule page edits, via deriveDashboardSchedule()
// (defined in the Schedule Page section below). This is what makes
// cancelling/editing/rescheduling a class show up on the Dashboard too.

// NOTE: "assignments" for the Dashboard's Upcoming Assignments card
// are no longer static either — App() derives them from the shared
// `assignments` state via deriveDashboardAssignments() (defined in
// the Assignments & Deadlines section further down).

// NOTE: "announcements" for the Dashboard's Recent Announcements card
// are no longer static either — App() derives them from the shared
// `announcements` state via deriveDashboardAnnouncements() (defined in
// the Announcements & Updates section further down).

// NOTE: "attendance" for the Dashboard's Attendance Overview card is
// no longer static either — App() derives it from the shared
// `attendanceRecords` state via deriveDashboardAttendance() (defined
// in the Attendance section further down), calculated with the same
// real formula the Attendance page itself uses.

// NOTE: there is no static `studentProfile` const anymore either —
// see `initialProfile` / the `profile` state in App, editable from
// the new Profile page.

/* ============================================================
   NAVIGATION CONFIG
   ============================================================ */
const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Schedule", icon: CalendarClock },
  { label: "Notes", icon: NotebookPen },
  { label: "Assignments", icon: ClipboardList },
  { label: "Attendance", icon: CheckSquare },
  { label: "Announcements", icon: Megaphone },
  { label: "Calendar", icon: CalendarRange },
  { label: "Control Center", icon: SlidersVertical },
];

/* ============================================================
   Sidebar.jsx (component)
   ============================================================ */
function Sidebar({ active, onSelect, mobileOpen, onClose, profile, onOpenProfile }) {
  return (
    <>
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}
      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-full w-64 flex flex-col justify-between transition-transform duration-200
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{ background: "var(--ink)" }}
      >
        <div>
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center cs-serif font-semibold text-sm"
                style={{ background: "var(--gold)", color: "var(--ink)" }}
              >
                CS
              </div>
              <span className="cs-serif text-lg font-semibold text-white tracking-tight">
                ClassSync
              </span>
            </div>
            <button onClick={onClose} className="lg:hidden text-white/60">
              <X size={20} />
            </button>
          </div>

          <nav className="mt-2 px-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = active === item.label;
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => onSelect(item.label)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors relative"
                  style={{
                    color: isActive ? "#fff" : "rgba(255,255,255,0.62)",
                    background: isActive ? "rgba(255,255,255,0.07)" : "transparent",
                  }}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
                      style={{ background: "var(--gold)" }}
                    />
                  )}
                  <Icon size={17} strokeWidth={1.8} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-3 pb-6">
          <button
            onClick={() => onSelect("Settings")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm"
            style={{
              color: active === "Settings" ? "#fff" : "rgba(255,255,255,0.62)",
              background: active === "Settings" ? "rgba(255,255,255,0.07)" : "transparent",
            }}
          >
            <Settings size={17} strokeWidth={1.8} />
            Settings
          </button>
          <button
            onClick={onOpenProfile}
            className="mt-4 pt-4 flex items-center gap-3 w-full text-left"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Avatar profile={profile} size={32} />
            <div className="leading-tight overflow-hidden">
              <p className="text-white text-sm truncate">{profile.name || "Set up your profile"}</p>
              <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.5)" }}>
                {profile.roll || "Tap to add your details"}
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}

/* ============================================================
   MobileBottomNav.jsx (component) — primary mobile navigation.
   The four most-used pages get a direct tap target; everything
   else (Attendance, Notes, Announcements, Profile, Control
   Center, Settings) stays reachable through "More", which opens
   the SAME sidebar drawer already used on tablet — not a second
   navigation system.
   ============================================================ */
function MobileBottomNav({ active, onSelect, onMore }) {
  const items = [
    { key: "Dashboard", label: "Home", icon: LayoutDashboard },
    { key: "Schedule", label: "Schedule", icon: CalendarClock },
    { key: "Calendar", label: "Calendar", icon: CalendarRange },
    { key: "Assignments", label: "Assignments", icon: ClipboardList },
  ];
  const isMoreActive = !items.some((i) => i.key === active);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch"
      style={{
        background: "var(--panel)",
        borderTop: "1px solid var(--line)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2"
          >
            <Icon size={19} strokeWidth={isActive ? 2.2 : 1.7} style={{ color: isActive ? "var(--gold)" : "var(--slate)" }} />
            <span className="text-[10px] font-medium" style={{ color: isActive ? "var(--gold)" : "var(--slate)" }}>{item.label}</span>
          </button>
        );
      })}
      <button onClick={onMore} className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2">
        <Menu size={19} strokeWidth={isMoreActive ? 2.2 : 1.7} style={{ color: isMoreActive ? "var(--gold)" : "var(--slate)" }} />
        <span className="text-[10px] font-medium" style={{ color: isMoreActive ? "var(--gold)" : "var(--slate)" }}>More</span>
      </button>
    </nav>
  );
}

/* ============================================================
   NotificationBell.jsx (component)
   ============================================================ */
function NotificationBell({ unreadCount, onClick }) {
  return (
    <button onClick={onClick} className="relative" style={{ color: "var(--ink-soft)" }} aria-label="Notifications">
      <Bell size={19} strokeWidth={1.8} />
      {unreadCount > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[10px] font-semibold"
          style={{ background: "var(--warn)", color: "#fff" }}
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}

/* ============================================================
   Header.jsx (component)
   ============================================================ */
function Header({ onMenuClick, profile, unreadCount, onBellClick, onOpenProfile, onOpenSearch }) {
  return (
    <header
      className="flex items-center justify-between gap-3 px-4 sm:px-8 py-4 sticky top-0 z-30"
      style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)" }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg flex-1 max-w-sm text-left"
          style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
        >
          <Search size={16} style={{ color: "var(--slate)" }} />
          <span className="text-sm flex-1 truncate" style={{ color: "var(--slate)" }}>
            Search classes, subjects, assignments…
          </span>
          <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--slate)" }}>
            ⌘K
          </span>
        </button>
      </div>

      <div className="flex items-center gap-4 sm:gap-5 flex-shrink-0">
        <NotificationBell unreadCount={unreadCount} onClick={onBellClick} />
        <button onClick={onOpenProfile} className="hidden sm:flex items-center gap-2.5 pl-4" style={{ borderLeft: "1px solid var(--line)" }}>
          <Avatar profile={profile} size={32} />
          <div className="leading-tight text-left">
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
              {profile.name || "Set up your profile"}
            </p>
            <p className="text-[11px]" style={{ color: "var(--slate)" }}>
              {profile.semester ? `${profile.semester} · ${profile.section}` : "Tap to add your details"}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}

/* ============================================================
   GreetingBanner.jsx (component)
   ============================================================ */
function GreetingBanner({ profile, remainingCount }) {
  const today = new Date(2026, 8, 10); // Thu, 10 Sep 2026
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const firstName = profile.name ? profile.name.split(" ")[0] : null;
  // Custom greeting if the student set one, otherwise derive it from
  // the demo clock rather than always saying "afternoon".
  const hour = Math.floor(REFERENCE_NOW_MINUTES / 60);
  const autoGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const greeting = livePreferences.greeting?.trim() || autoGreeting;

  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
      <div>
        <h1 className="cs-serif text-[26px] sm:text-[30px] font-semibold" style={{ color: "var(--ink)" }}>
          {firstName ? `${greeting}, ${firstName}` : "Set up your profile"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--slate)" }}>
          {firstName
            ? `You have ${remainingCount} classes left today${profile.program ? ` · ${profile.program}` : ""}`
            : "Add your name and program in Settings to personalize your dashboard."}
        </p>
      </div>
      <p className="text-sm font-medium" style={{ color: "var(--ink-soft)" }}>
        {dateStr}
      </p>
    </div>
  );
}

/* ============================================================
   NextClassCard.jsx (component)
   ============================================================ */
function NextClassCard({ nextClass }) {
  if (!nextClass) {
    return (
      <div className="cs-card p-5 sm:p-6 flex items-center justify-center" style={{ background: "var(--gold-tint)", borderColor: "var(--gold-tint-line)" }}>
        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>No more classes today</p>
      </div>
    );
  }
  return (
    <div
      className="cs-card p-5 sm:p-6 flex flex-col justify-between"
      style={{ background: "var(--gold-tint)", borderColor: "var(--gold-tint-line)" }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded"
          style={{ background: "var(--ink)", color: "var(--gold-tint)", letterSpacing: "0.06em" }}
        >
          Next Class
        </span>
        <span className="text-xs font-medium" style={{ color: "var(--warn)" }}>
          Starts in 20 min
        </span>
      </div>

      <div className="mt-5">
        <p className="cs-serif text-2xl font-semibold" style={{ color: "var(--ink)" }}>
          {nextClass.subject}
        </p>
        <p className="text-sm mt-1.5" style={{ color: "var(--ink-soft)" }}>
          {nextClass.time}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-4 text-sm" style={{ color: "var(--ink-soft)" }}>
        <span className="flex items-center gap-1.5">
          <MapPin size={14} /> {nextClass.room}
        </span>
        <span className="flex items-center gap-1.5">
          <User2 size={14} /> {nextClass.faculty}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   TodayScheduleCard.jsx (component)
   ============================================================ */
const scheduleStyles = {
  done: { dot: "var(--slate-dim)", label: "Completed", labelColor: "var(--slate)" },
  next: { dot: "var(--gold)", label: "Up next", labelColor: "var(--gold)" },
  upcoming: { dot: "var(--slate-dim)", label: "Scheduled", labelColor: "var(--slate)" },
  cancelled: { dot: "var(--warn)", label: "Cancelled", labelColor: "var(--warn)" },
};

function TodayScheduleCard({ schedule }) {
  return (
    <div className="cs-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="cs-serif text-lg font-semibold" style={{ color: "var(--ink)" }}>
          Today's Schedule
        </h2>
        <button className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--gold)" }}>
          Full timetable <ArrowUpRight size={13} />
        </button>
      </div>

      <div className="flex flex-col cs-scroll max-h-72 overflow-y-auto pr-1">
        {schedule.map((cls, idx) => {
          const s = scheduleStyles[cls.status];
          const isCancelled = cls.status === "cancelled";
          return (
            <div
              key={cls.id}
              className="flex items-center gap-3 py-3"
              style={{ borderTop: idx === 0 ? "none" : "1px solid var(--line)" }}
            >
              <div className="w-[92px] flex-shrink-0 text-xs font-medium" style={{ color: "var(--slate)" }}>
                {cls.time}
              </div>
              {isCancelled ? (
                <Ban size={13} style={{ color: s.dot, flexShrink: 0 }} />
              ) : (
                <CircleDot size={13} style={{ color: s.dot, flexShrink: 0 }} />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{
                    color: isCancelled ? "var(--slate)" : "var(--text)",
                    textDecoration: isCancelled ? "line-through" : "none",
                  }}
                >
                  {cls.subject}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--slate)" }}>
                  {cls.room} · {cls.faculty}
                </p>
              </div>
              <span className="text-[11px] font-medium flex-shrink-0" style={{ color: s.labelColor }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   UpcomingAssignmentsCard.jsx (component)
   ============================================================ */
const urgencyStyle = {
  high: { text: "var(--warn)", bg: "var(--warn-tint)" },
  medium: { text: "#8A6A1F", bg: "var(--gold-tint)" },
  low: { text: "var(--good)", bg: "var(--good-tint)" },
};

function UpcomingAssignmentsCard({ assignments }) {
  return (
    <div className="cs-card p-5 sm:p-6 flex flex-col">
      <h2 className="cs-serif text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
        Upcoming Assignments
      </h2>
      <div className="flex flex-col gap-3">
        {assignments.map((a) => {
          const u = urgencyStyle[a.urgency];
          return (
            <div key={a.id} className="pb-3" style={{ borderBottom: "1px solid var(--line)" }}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-snug" style={{ color: "var(--text)" }}>
                  {a.title}
                </p>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: u.bg, color: u.text }}
                >
                  {a.due}
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--slate)" }}>
                {a.subject}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   RecentAnnouncementsCard.jsx (component)
   ============================================================ */
function RecentAnnouncementsCard({ announcements }) {
  return (
    <div className="cs-card p-5 sm:p-6 flex flex-col">
      <h2 className="cs-serif text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
        Recent Announcements
      </h2>
      <div className="flex flex-col gap-3">
        {announcements.map((n) => (
          <div key={n.id} className="pb-3" style={{ borderBottom: "1px solid var(--line)" }}>
            <p className="text-sm font-medium leading-snug" style={{ color: "var(--text)" }}>
              {n.title}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--slate)" }}>
              {n.source} · {n.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   AttendanceOverviewCard.jsx (component)
   ============================================================ */
function AttendanceRing({ pct }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const color = pct >= 75 ? "var(--good)" : "var(--warn)";
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={r} fill="none" stroke="var(--line)" strokeWidth="8" />
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 44 44)"
      />
      <text
        x="44"
        y="49"
        textAnchor="middle"
        fontSize="18"
        fontWeight="600"
        fontFamily="IBM Plex Sans"
        fill="var(--ink)"
      >
        {pct}%
      </text>
    </svg>
  );
}

function AttendanceOverviewCard({ attendance }) {
  const low = attendance.subjects.filter((s) => s.pct < attendance.minimumRequired);
  return (
    <div className="cs-card p-5 sm:p-6 flex flex-col">
      <h2 className="cs-serif text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
        Attendance Overview
      </h2>

      <div className="flex items-center gap-5 mb-4">
        <AttendanceRing pct={attendance.overall} />
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
            Overall attendance
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--slate)" }}>
            Minimum required: {attendance.minimumRequired}%
          </p>
          {low.length > 0 && (
            <p className="text-xs mt-1 font-medium" style={{ color: "var(--warn)" }}>
              {low.length} subject{low.length > 1 ? "s" : ""} below minimum
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {attendance.subjects.map((s) => (
          <div key={s.subjectId} className="flex items-center gap-3">
            <span className="text-xs w-32 flex-shrink-0 truncate" style={{ color: "var(--slate)" }}>
              {s.name}
            </span>
            <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--line)" }}>
              <div
                className="h-1.5 rounded-full"
                style={{
                  width: `${s.pct}%`,
                  background: s.pct >= attendance.minimumRequired ? "var(--good)" : "var(--warn)",
                }}
              />
            </div>
            <span className="text-xs w-9 text-right flex-shrink-0" style={{ color: "var(--text)" }}>
              {s.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Dashboard.jsx (component) — composes all dashboard cards,
   passing data down as props rather than each card reaching
   into global state directly.
   ============================================================ */
function Dashboard({ profile, schedule, nextClass, assignments, announcements, attendance, notifications, calendarEvents, onViewCalendar, onQuickAction }) {
  const remainingCount = schedule.filter((c) => c.status === "next" || c.status === "upcoming").length;

  // Personalization preferences — the student chooses which cards
  // appear, so the bottom row is built dynamically rather than a
  // fixed 3-column grid that would leave holes when one is hidden.
  const p = livePreferences;
  const bottomCards = [
    p.showUpcomingAssignments && <UpcomingAssignmentsCard key="assignments" assignments={assignments} />,
    p.showAnnouncements && <RecentAnnouncementsCard key="announcements" announcements={announcements} />,
    <AttendanceOverviewCard key="attendance" attendance={attendance} />,
  ].filter(Boolean);
  const bottomCols = bottomCards.length === 1 ? "md:grid-cols-1" : bottomCards.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <main className="flex-1 px-4 sm:px-8 py-6 max-w-6xl w-full mx-auto">
      <GreetingBanner profile={profile} remainingCount={remainingCount} />

      {/* Mobile priority order: Next Class + Today's Schedule first,
          then Important Updates, then the assignment/attendance
          row, with Quick Actions last — matches how a student
          actually scans this on a phone. */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
        <div className="lg:col-span-2">
          <NextClassCard nextClass={nextClass} />
        </div>
        <div className="lg:col-span-3">
          <TodayScheduleCard schedule={schedule} />
        </div>
      </div>

      {p.showAttendanceWarnings && <ImportantUpdatesCard notifications={notifications} />}
      <UpcomingAcademicEventsCard events={calendarEvents} onViewCalendar={onViewCalendar} />

      <div className={`grid grid-cols-1 ${bottomCols} gap-5`}>{bottomCards}</div>
    </main>
  );
}

/* ================================================================
   ======================  SCHEDULE PAGE  ==========================
   ================================================================
   Everything below powers Step 2: the Schedule page. It is fully
   separate from the Dashboard above — the Dashboard's data and
   components are untouched.

   All state here is local React state (useState) held inside
   SchedulePage. There is no database, backend, or persistence —
   refreshing the page resets it back to the sample data below.
   ================================================================ */

/* ------------------------------------------------------------
   Date & time helpers
   (In a multi-file build: utils/dateHelpers.js)
   ------------------------------------------------------------ */
function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function parseISODate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function startOfWeek(date) {
  // Monday as the first day of the academic week
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun ... 6 = Sat
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(d, diff);
}
function isSameDate(a, b) {
  return toISODate(a) === toISODate(b);
}
function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function formatTimeLabel(minutes) {
  const h = Math.floor(minutes / 60);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${suffix}`;
}
function formatDayNum(date) {
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}
function formatLongDate(date) {
  return date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function formatMonthYear(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
function formatWeekRange(weekStart) {
  const weekEnd = addDays(weekStart, 5); // Mon–Sat
  const start = weekStart.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  const end = weekEnd.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  return `${start} – ${end}`;
}
function getMonthMatrix(anchorDate) {
  const gridStart = startOfWeek(new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1));
  const weeks = [];
  let cursor = gridStart;
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let i = 0; i < 7; i++) {
      row.push(cursor);
      cursor = addDays(cursor, 1);
    }
    weeks.push(row);
  }
  return weeks;
}

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_START_MIN = 9 * 60; // 9:00 AM
const DAY_END_MIN = 17 * 60; // 5:00 PM
const PX_PER_MIN = 1;

// "Today" for demo purposes — matches the date used on the Dashboard.
const REFERENCE_TODAY = new Date(2026, 8, 10);
const CURRENT_WEEK_START = startOfWeek(REFERENCE_TODAY);
const PREV_WEEK_START = addDays(CURRENT_WEEK_START, -7);
const NEXT_WEEK_START = addDays(CURRENT_WEEK_START, 7);

// "Now" for demo purposes — used only to work out which of today's
// classes is done / next / upcoming for the Dashboard's cards.
const REFERENCE_NOW_MINUTES = 11 * 60 + 20; // 11:20 AM

function atDay(weekStart, dayOffset) {
  return toISODate(addDays(weekStart, dayOffset));
}

/* ------------------------------------------------------------
   SAMPLE / DEMO TIMETABLE DATA — NOT the user's real schedule.
   (In a multi-file build: data/scheduleDemoData.js)

   This is intentionally separate from the Dashboard's data above
   and centralized here so it's easy to find and swap out later.
   It references the same centralized subjects (by subjectId) used
   everywhere else, so renaming a subject in Settings → Subjects
   updates these too, automatically.

   Each entry:
     { id, subjectId, facultyId, room, date, startTime, endTime,
       status: "scheduled" | "cancelled" | "rescheduled" | "extra",
       description, original? }
   ------------------------------------------------------------ */
const scheduleDemoData = [
  // ---- Sample: previous week ----
  { id: "s1", subjectId: "sub-dsa", facultyId: "fac-nair", room: "Room 204", date: atDay(PREV_WEEK_START, 1), startTime: "09:00", endTime: "10:00", status: "scheduled", description: "" },
  { id: "s2", subjectId: "sub-dbms", facultyId: "fac-iyer", room: "Room 204", date: atDay(PREV_WEEK_START, 2), startTime: "10:15", endTime: "11:15", status: "scheduled", description: "" },
  { id: "s3", subjectId: "sub-cn", facultyId: "fac-menon", room: "Room 108", date: atDay(PREV_WEEK_START, 3), startTime: "11:30", endTime: "12:30", status: "cancelled", description: "Faculty on leave." },
  { id: "s4", subjectId: "sub-se", facultyId: "fac-rao", room: "Lab 3", date: atDay(PREV_WEEK_START, 4), startTime: "14:00", endTime: "16:00", status: "extra", description: "Extra practice session before the lab exam." },

  // ---- Sample: current week ----
  { id: "s5", subjectId: "sub-dsa", facultyId: "fac-nair", room: "Room 204", date: atDay(CURRENT_WEEK_START, 0), startTime: "09:00", endTime: "10:00", status: "scheduled", description: "" },
  { id: "s6", subjectId: "sub-dbms", facultyId: "fac-iyer", room: "Room 204", date: atDay(CURRENT_WEEK_START, 0), startTime: "10:15", endTime: "11:15", status: "scheduled", description: "" },
  { id: "s7", subjectId: "sub-cn", facultyId: "fac-menon", room: "Room 108", date: atDay(CURRENT_WEEK_START, 0), startTime: "11:30", endTime: "12:30", status: "scheduled", description: "" },

  { id: "s8", subjectId: "sub-os", facultyId: "fac-kulkarni", room: "Room 108", date: atDay(CURRENT_WEEK_START, 1), startTime: "09:00", endTime: "10:00", status: "scheduled", description: "" },
  { id: "s9", subjectId: "sub-dsa", facultyId: "fac-nair", room: "Room 204", date: atDay(CURRENT_WEEK_START, 1), startTime: "10:15", endTime: "11:15", status: "scheduled", description: "" },
  { id: "s10", subjectId: "sub-se", facultyId: "fac-rao", room: "Lab 3", date: atDay(CURRENT_WEEK_START, 1), startTime: "14:00", endTime: "16:00", status: "scheduled", description: "" },

  { id: "s11", subjectId: "sub-dbms", facultyId: "fac-iyer", room: "Room 204", date: atDay(CURRENT_WEEK_START, 2), startTime: "09:00", endTime: "10:00", status: "cancelled", description: "Faculty attending a conference." },
  { id: "s12", subjectId: "sub-cn", facultyId: "fac-menon", room: "Room 108", date: atDay(CURRENT_WEEK_START, 2), startTime: "10:15", endTime: "11:15", status: "scheduled", description: "" },
  { id: "s13", subjectId: "sub-os", facultyId: "fac-kulkarni", room: "Room 108", date: atDay(CURRENT_WEEK_START, 2), startTime: "11:30", endTime: "12:30", status: "scheduled", description: "" },

  { id: "s14", subjectId: "sub-dsa", facultyId: "fac-nair", room: "Room 204", date: atDay(CURRENT_WEEK_START, 3), startTime: "09:00", endTime: "10:00", status: "scheduled", description: "" },
  { id: "s15", subjectId: "sub-dbms", facultyId: "fac-iyer", room: "Room 204", date: atDay(CURRENT_WEEK_START, 3), startTime: "10:15", endTime: "11:15", status: "scheduled", description: "" },
  { id: "s16", subjectId: "sub-cn", facultyId: "fac-menon", room: "Room 108", date: atDay(CURRENT_WEEK_START, 3), startTime: "11:30", endTime: "12:30", status: "scheduled", description: "", reminderMinutesBefore: 15 },
  { id: "s17", subjectId: "sub-os", facultyId: "fac-kulkarni", room: "Room 108", date: atDay(CURRENT_WEEK_START, 3), startTime: "13:00", endTime: "14:00", status: "cancelled", description: "Faculty unavailable." },
  { id: "s18", subjectId: "sub-se", facultyId: "fac-rao", room: "Lab 3", date: atDay(CURRENT_WEEK_START, 3), startTime: "14:30", endTime: "16:30", status: "scheduled", description: "" },

  { id: "s19", subjectId: "sub-cn", facultyId: "fac-menon", room: "Room 108", date: atDay(CURRENT_WEEK_START, 4), startTime: "09:00", endTime: "10:00", status: "scheduled", description: "" },
  {
    id: "s20", subjectId: "sub-dbms", facultyId: "fac-iyer", room: "Room 210",
    date: atDay(CURRENT_WEEK_START, 4), startTime: "11:00", endTime: "12:00",
    status: "rescheduled", description: "Moved to accommodate a faculty meeting.",
    original: { date: atDay(CURRENT_WEEK_START, 4), startTime: "09:00", endTime: "10:00", room: "Room 204" },
  },
  { id: "s21", subjectId: "sub-se", facultyId: "fac-rao", room: "Lab 3", date: atDay(CURRENT_WEEK_START, 4), startTime: "13:00", endTime: "15:00", status: "extra", description: "Extra doubt-clearing session before submission." },

  { id: "s22", subjectId: "sub-se", facultyId: "fac-rao", room: "Lab 3", date: atDay(CURRENT_WEEK_START, 5), startTime: "09:00", endTime: "11:00", status: "scheduled", description: "" },
  { id: "s23", subjectId: "sub-dsa", facultyId: "fac-nair", room: "Room 204", date: atDay(CURRENT_WEEK_START, 5), startTime: "11:15", endTime: "12:15", status: "scheduled", description: "" },
  { id: "s24", subjectId: null, facultyId: null, room: "Auditorium", date: atDay(CURRENT_WEEK_START, 5), startTime: "12:30", endTime: "14:00", status: "extra", description: "Guest lecture organized by the Dept. of CSE.", customTitle: "Cloud Computing Guest Lecture" },

  // ---- Sample: next week ----
  { id: "s25", subjectId: "sub-dsa", facultyId: "fac-nair", room: "Room 204", date: atDay(NEXT_WEEK_START, 0), startTime: "09:00", endTime: "10:00", status: "scheduled", description: "" },
  { id: "s26", subjectId: "sub-dbms", facultyId: "fac-iyer", room: "Room 204", date: atDay(NEXT_WEEK_START, 1), startTime: "10:15", endTime: "11:15", status: "scheduled", description: "" },
  { id: "s27", subjectId: "sub-os", facultyId: "fac-kulkarni", room: "Room 108", date: atDay(NEXT_WEEK_START, 1), startTime: "11:30", endTime: "12:30", status: "scheduled", description: "" },
  { id: "s28", subjectId: "sub-cn", facultyId: "fac-menon", room: "Room 108", date: atDay(NEXT_WEEK_START, 2), startTime: "09:00", endTime: "10:00", status: "scheduled", description: "" },
  { id: "s29", subjectId: "sub-se", facultyId: "fac-rao", room: "Lab 3", date: atDay(NEXT_WEEK_START, 3), startTime: "14:00", endTime: "16:00", status: "scheduled", description: "" },
  { id: "s30", subjectId: "sub-dsa", facultyId: "fac-nair", room: "Room 204", date: atDay(NEXT_WEEK_START, 4), startTime: "09:00", endTime: "10:00", status: "scheduled", description: "" },
  { id: "s31", subjectId: "sub-dbms", facultyId: "fac-iyer", room: "Room 204", date: atDay(NEXT_WEEK_START, 4), startTime: "10:15", endTime: "11:15", status: "scheduled", description: "" },
];

/* ------------------------------------------------------------
   Status configuration — single source of truth for the four
   class states and how they look (color, tint, legend dot).
   ------------------------------------------------------------ */
const STATUS_META = {
  scheduled: { label: "Scheduled", dot: "🟢", color: "var(--good)", tint: "var(--good-tint)" },
  cancelled: { label: "Cancelled", dot: "🔴", color: "var(--warn)", tint: "var(--warn-tint)" },
  rescheduled: { label: "Rescheduled", dot: "🟡", color: "var(--resched)", tint: "var(--resched-tint)" },
  extra: { label: "Extra Class", dot: "🟣", color: "var(--extra)", tint: "var(--extra-tint)" },
};

/* ------------------------------------------------------------
   Resolver — joins a raw class entry with subject/faculty names,
   the same pattern used on the Dashboard, so components read
   cls.subject / cls.faculty / cls.room directly.
   ------------------------------------------------------------ */
function resolveClass(cls) {
  return {
    ...cls,
    subject: cls.customTitle || getSubjectName(cls.subjectId),
    faculty: cls.facultyId ? getFacultyName(cls.facultyId) : "Guest Speaker",
  };
}
function classesOnDate(classes, iso) {
  return classes.filter((c) => c.date === iso).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
}

// Bridges the Schedule page's data (status: scheduled/cancelled/
// rescheduled/extra) into the shape the existing, unchanged Dashboard
// cards expect (status: done/next/upcoming/cancelled + a single
// `time` string). This is the one place the two pages' vocabularies
// meet, so editing a class in the Schedule page updates the Dashboard
// automatically without either page needing to know about the other.
function deriveDashboardSchedule(todayClasses) {
  const sorted = [...todayClasses].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  let nextAssigned = false;
  return sorted.map((cls) => {
    let status;
    if (cls.status === "cancelled") {
      status = "cancelled";
    } else {
      const endMin = timeToMinutes(cls.endTime);
      if (!nextAssigned && endMin > REFERENCE_NOW_MINUTES) {
        nextAssigned = true;
        status = "next";
      } else {
        status = nextAssigned ? "upcoming" : "done";
      }
    }
    return { ...cls, status, time: `${cls.startTime} – ${cls.endTime}` };
  });
}

/* ============================================================
   ScheduleLegend.jsx (component)
   ============================================================ */
function ScheduleLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: "var(--slate)" }}>
      {Object.values(STATUS_META).map((meta) => (
        <span key={meta.label} className="flex items-center gap-1.5">
          <span>{meta.dot}</span> {meta.label}
        </span>
      ))}
    </div>
  );
}

/* ============================================================
   ScheduleListRow.jsx (component) — shared row used by Day view
   and the Month view's day panel.
   ============================================================ */
function ScheduleListRow({ cls, onClick, showDivider }) {
  const meta = STATUS_META[cls.status];
  const isCancelled = cls.status === "cancelled";
  return (
    <button
      onClick={() => onClick(cls)}
      className="flex items-center gap-3 py-3 text-left w-full"
      style={{ borderTop: showDivider ? "1px solid var(--line)" : "none" }}
    >
      <div className="w-[92px] flex-shrink-0 text-xs font-medium flex items-center gap-1" style={{ color: "var(--slate)" }}>
        {cls.startTime} – {cls.endTime}
        {cls.reminderMinutesBefore != null && <Bell size={11} style={{ color: "var(--gold)" }} />}
      </div>
      <span className="flex-shrink-0">{meta.dot}</span>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate"
          style={{ color: isCancelled ? "var(--slate)" : "var(--text)", textDecoration: isCancelled ? "line-through" : "none" }}
        >
          {cls.subject}
        </p>
        <p className="text-xs truncate" style={{ color: "var(--slate)" }}>
          {cls.faculty} · {cls.room}
        </p>
        {cls.status === "rescheduled" && cls.original && (
          <p className="text-[11px] mt-0.5" style={{ color: "var(--resched)" }}>
            Originally {cls.original.startTime}–{cls.original.endTime}
          </p>
        )}
      </div>
      <span className="text-[11px] font-medium flex-shrink-0" style={{ color: meta.color }}>
        {meta.label}
      </span>
    </button>
  );
}

/* ============================================================
   ClassBlock.jsx (component) — a positioned block in Week view
   ============================================================ */
function ClassBlock({ cls, onClick, style }) {
  const meta = STATUS_META[cls.status];
  const isCancelled = cls.status === "cancelled";
  const hasReminder = cls.reminderMinutesBefore != null;
  return (
    <button
      onClick={() => onClick(cls)}
      className="absolute left-1 right-1 rounded-md px-2 py-1.5 text-left overflow-hidden"
      style={{ ...style, background: meta.tint, borderLeft: `3px solid ${meta.color}`, opacity: isCancelled ? 0.75 : 1 }}
    >
      {hasReminder && (
        <Bell size={10} className="absolute top-1.5 right-1.5" style={{ color: "var(--gold)" }} />
      )}
      <p
        className="text-[11px] font-semibold leading-tight truncate"
        style={{ color: "var(--ink)", textDecoration: isCancelled ? "line-through" : "none" }}
      >
        {cls.subject}
      </p>
      <p className="text-[10px] truncate" style={{ color: "var(--slate)" }}>
        {cls.startTime}–{cls.endTime}
      </p>
      {cls.status === "extra" && (
        <span className="text-[9px] font-semibold" style={{ color: meta.color }}>EXTRA CLASS</span>
      )}
      {cls.status === "rescheduled" && cls.original && (
        <span className="text-[9px] block truncate" style={{ color: meta.color }}>
          was {cls.original.startTime}–{cls.original.endTime}
        </span>
      )}
    </button>
  );
}

/* ============================================================
   CalendarHeader.jsx (component)
   ============================================================ */
function CalendarHeader({ view, onViewChange, rangeLabel, onPrev, onNext, onToday, onAddClass }) {
  return (
    <div className="mb-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
        <div>
          <h1 className="cs-serif text-[26px] sm:text-[30px] font-semibold" style={{ color: "var(--ink)" }}>
            Schedule
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--slate)" }}>
            Your classes, changes and extra sessions — all in one place.
          </p>
        </div>
        <button
          onClick={onAddClass}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium self-start sm:self-auto"
          style={{ background: "var(--ink)", color: "#fff" }}
        >
          <Plus size={16} /> Add Class
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={onPrev} className="cs-card p-2" style={{ color: "var(--ink-soft)" }} aria-label="Previous">
            <ChevronLeft size={16} />
          </button>
          <button onClick={onToday} className="cs-card px-3 py-2 text-xs font-medium" style={{ color: "var(--ink-soft)" }}>
            Today
          </button>
          <button onClick={onNext} className="cs-card p-2" style={{ color: "var(--ink-soft)" }} aria-label="Next">
            <ChevronRight size={16} />
          </button>
          <span className="text-sm font-medium ml-1" style={{ color: "var(--text)" }}>
            {rangeLabel}
          </span>
        </div>

        <div className="cs-card p-1 flex items-center gap-1 self-start">
          {["Day", "Week", "Month"].map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className="px-3 py-1.5 rounded-md text-xs font-medium"
              style={{ background: view === v ? "var(--ink)" : "transparent", color: view === v ? "#fff" : "var(--slate)" }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   WeekView.jsx (component)
   ============================================================ */
function WeekView({ weekStart, classes, onSelectClass }) {
  const gridHeight = (DAY_END_MIN - DAY_START_MIN) * PX_PER_MIN;
  const hourMarks = [];
  for (let m = DAY_START_MIN; m <= DAY_END_MIN; m += 60) hourMarks.push(m);

  const days = WEEK_DAYS.map((label, i) => {
    const date = addDays(weekStart, i);
    return { label, date, iso: toISODate(date), isToday: isSameDate(date, REFERENCE_TODAY) };
  });

  return (
    <div className="cs-card overflow-x-auto cs-scroll">
      <div style={{ minWidth: "760px" }}>
        <div className="grid" style={{ gridTemplateColumns: "64px repeat(6, 1fr)" }}>
          <div />
          {days.map((day) => (
            <div
              key={day.iso}
              className="text-center py-3 px-1"
              style={{
                borderLeft: "1px solid var(--line)",
                borderBottom: "1px solid var(--line)",
                background: day.isToday ? "var(--gold-tint)" : "transparent",
              }}
            >
              <p className="text-xs font-semibold" style={{ color: "var(--ink)" }}>{day.label}</p>
              <p className="text-[11px]" style={{ color: "var(--slate)" }}>{formatDayNum(day.date)}</p>
            </div>
          ))}
        </div>

        <div className="grid" style={{ gridTemplateColumns: "64px repeat(6, 1fr)" }}>
          <div style={{ position: "relative", height: gridHeight }}>
            {hourMarks.map((m) => (
              <div
                key={m}
                className="absolute right-2 text-[10px]"
                style={{ top: (m - DAY_START_MIN) * PX_PER_MIN - 6, color: "var(--slate)" }}
              >
                {formatTimeLabel(m)}
              </div>
            ))}
          </div>

          {days.map((day) => {
            const dayClasses = classesOnDate(classes, day.iso);
            return (
              <div key={day.iso} className="relative" style={{ height: gridHeight, borderLeft: "1px solid var(--line)" }}>
                {hourMarks.slice(1).map((m) => (
                  <div
                    key={m}
                    className="absolute left-0 right-0"
                    style={{ top: (m - DAY_START_MIN) * PX_PER_MIN, borderTop: "1px solid var(--line)" }}
                  />
                ))}
                {dayClasses.map((cls) => {
                  const top = (timeToMinutes(cls.startTime) - DAY_START_MIN) * PX_PER_MIN;
                  const height = Math.max((timeToMinutes(cls.endTime) - timeToMinutes(cls.startTime)) * PX_PER_MIN, 40);
                  return <ClassBlock key={cls.id} cls={cls} onClick={onSelectClass} style={{ top, height }} />;
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DayView.jsx (component)
   ============================================================ */
function DayView({ date, classes, onSelectClass }) {
  const dayClasses = classesOnDate(classes, toISODate(date));
  return (
    <div className="cs-card p-5 sm:p-6">
      <h2 className="cs-serif text-lg font-semibold mb-1" style={{ color: "var(--ink)" }}>
        {formatLongDate(date)}
      </h2>
      <p className="text-xs mb-4" style={{ color: "var(--slate)" }}>
        {dayClasses.length} class{dayClasses.length !== 1 ? "es" : ""} scheduled
      </p>
      {dayClasses.length === 0 ? (
        <p className="text-sm py-8 text-center" style={{ color: "var(--slate)" }}>
          No classes scheduled for this day.
        </p>
      ) : (
        <div className="flex flex-col">
          {dayClasses.map((cls, idx) => (
            <ScheduleListRow key={cls.id} cls={cls} onClick={onSelectClass} showDivider={idx !== 0} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MonthView.jsx (component)
   ============================================================ */
function MonthView({ anchorDate, classes, selectedDate, onSelectDay, onSelectClass }) {
  const weeks = getMonthMatrix(anchorDate);
  const month = anchorDate.getMonth();
  const selectedDayClasses = classesOnDate(classes, toISODate(selectedDate));

  return (
    <div>
      <div className="cs-card overflow-hidden">
        <div className="grid grid-cols-7" style={{ borderBottom: "1px solid var(--line)" }}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="text-center py-2 text-[11px] font-semibold" style={{ color: "var(--slate)" }}>
              {d}
            </div>
          ))}
        </div>
        {weeks.map((row, ri) => (
          <div key={ri} className="grid grid-cols-7">
            {row.map((date) => {
              const iso = toISODate(date);
              const inMonth = date.getMonth() === month;
              const dayClasses = classesOnDate(classes, iso);
              const isSelected = isSameDate(date, selectedDate);
              const isToday = isSameDate(date, REFERENCE_TODAY);
              return (
                <button
                  key={iso}
                  onClick={() => onSelectDay(date)}
                  className="flex flex-col items-start p-2 text-left"
                  style={{
                    minHeight: "76px",
                    borderTop: "1px solid var(--line)",
                    borderLeft: "1px solid var(--line)",
                    background: isSelected ? "var(--gold-tint)" : "transparent",
                    opacity: inMonth ? 1 : 0.4,
                  }}
                >
                  <span className="text-xs font-medium mb-1" style={{ color: isToday ? "var(--gold)" : "var(--text)" }}>
                    {date.getDate()}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {dayClasses.slice(0, 3).map((cls) => (
                      <span key={cls.id} className="text-[10px]">{STATUS_META[cls.status].dot}</span>
                    ))}
                    {dayClasses.length > 3 && (
                      <span className="text-[10px]" style={{ color: "var(--slate)" }}>+{dayClasses.length - 3}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="cs-card p-5 sm:p-6 mt-4">
        <h3 className="cs-serif text-base font-semibold mb-3" style={{ color: "var(--ink)" }}>
          {formatLongDate(selectedDate)}
        </h3>
        {selectedDayClasses.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--slate)" }}>No classes scheduled for this day.</p>
        ) : (
          <div className="flex flex-col">
            {selectedDayClasses.map((cls, idx) => (
              <ScheduleListRow key={cls.id} cls={cls} onClick={onSelectClass} showDivider={idx !== 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   ModalShell.jsx (component) — shared overlay/panel for all modals
   ============================================================ */
function ModalShell({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: "rgba(15,20,32,0.5)" }}>
      <div className={`cs-card w-full ${wide ? "max-w-lg" : "max-w-md"} max-h-[90vh] overflow-y-auto cs-scroll`} style={{ background: "var(--panel)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--line)" }}>
          <h3 className="cs-serif text-lg font-semibold" style={{ color: "var(--ink)" }}>{title}</h3>
          <button onClick={onClose} style={{ color: "var(--slate)" }} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, strike }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs flex-shrink-0 w-28" style={{ color: "var(--slate)" }}>{label}</span>
      <span className="text-sm text-right flex-1" style={{ color: "var(--text)", textDecoration: strike ? "line-through" : "none" }}>
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   ReminderSelector.jsx (component) — set/change/remove a
   reminder for a single class, shown inside ClassDetailsModal.
   ============================================================ */
const REMINDER_OPTIONS = [5, 10, 15, 30, 60];
function reminderLabel(minutes) {
  return minutes === 60 ? "1 hour" : `${minutes} minutes`;
}

function ReminderSelector({ reminderMinutesBefore, onChange }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium" style={{ color: "var(--slate)" }}>🔔 Remind me</span>
        <div className="flex flex-wrap gap-2">
          {REMINDER_OPTIONS.map((m) => (
            <button
              key={m}
              onClick={() => {
                onChange(m);
                setEditing(false);
              }}
              className="px-3 py-1.5 rounded-md text-xs font-medium"
              style={{
                background: reminderMinutesBefore === m ? "var(--gold)" : "var(--paper)",
                color: reminderMinutesBefore === m ? "#fff" : "var(--ink-soft)",
                border: "1px solid var(--line)",
              }}
            >
              {reminderLabel(m)} before
            </button>
          ))}
          <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-md text-xs font-medium" style={{ color: "var(--slate)" }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (reminderMinutesBefore == null) {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => onChange(livePreferences.reminderPreference)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium"
          style={{ background: "var(--gold-tint)", color: "#8A6A1F" }}
        >
          <Bell size={13} /> Set Reminder ({reminderLabel(livePreferences.reminderPreference)} before)
        </button>
        <button onClick={() => setEditing(true)} className="text-xs font-medium" style={{ color: "var(--gold)" }}>
          Choose a different time
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <p className="text-sm" style={{ color: "var(--text)" }}>
        Reminder: <span style={{ color: "var(--gold)" }}>🔔 {reminderLabel(reminderMinutesBefore)} before</span>
      </p>
      <div className="flex gap-2">
        <button onClick={() => setEditing(true)} className="text-xs font-medium" style={{ color: "var(--gold)" }}>
          Change reminder
        </button>
        <button onClick={() => onChange(null)} className="text-xs font-medium" style={{ color: "var(--warn)" }}>
          Remove reminder
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   ClassDetailsModal.jsx (component)
   ============================================================ */
function ClassDetailsModal({ cls, onClose, onEdit, onCancelClass, onRestoreClass, onReschedule, onSetReminder, resources, onViewResources }) {
  const meta = STATUS_META[cls.status];
  return (
    <ModalShell title="Class Details" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <DetailRow label="Subject" value={cls.subject} />
        <DetailRow label="Faculty" value={cls.faculty} />
        <DetailRow label="Date" value={formatLongDate(parseISODate(cls.date))} />
        {cls.status === "rescheduled" && cls.original ? (
          <>
            <DetailRow label="Originally scheduled for" value={`${cls.original.startTime} – ${cls.original.endTime} · ${cls.original.room}`} strike />
            <DetailRow
              label="Current time"
              value={
                <span style={{ color: "var(--resched)", fontWeight: 600 }}>
                  {cls.startTime} – {cls.endTime} · {cls.room}
                </span>
              }
            />
          </>
        ) : (
          <DetailRow label="Time" value={`${cls.startTime} – ${cls.endTime}`} />
        )}
        <DetailRow label="Classroom" value={cls.room} />
        <DetailRow label="Status" value={<span style={{ color: meta.color }}>{meta.dot} {meta.label}</span>} />
        <DetailRow label="Description" value={cls.description || "—"} />
      </div>

      <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--line)" }}>
        <ReminderSelector reminderMinutesBefore={cls.reminderMinutesBefore} onChange={onSetReminder} />
      </div>

      {resources && <ClassResourcesSection cls={cls} resources={resources} onViewResources={onViewResources} />}

      <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: "1px solid var(--line)" }}>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium"
          style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}
        >
          <Pencil size={13} /> Edit
        </button>
        {cls.status === "cancelled" ? (
          <button
            onClick={onRestoreClass}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium"
            style={{ background: "var(--good-tint)", color: "var(--good)" }}
          >
            <RotateCcw size={13} /> Restore Class
          </button>
        ) : (
          <button
            onClick={onCancelClass}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium"
            style={{ background: "var(--warn-tint)", color: "var(--warn)" }}
          >
            <Ban size={13} /> Cancel Class
          </button>
        )}
        <button
          onClick={onReschedule}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium"
          style={{ background: "var(--resched-tint)", color: "var(--resched)" }}
        >
          <CalendarDays size={13} /> Reschedule Class
        </button>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   FormField.jsx (component)
   ============================================================ */
function FormField({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium" style={{ color: "var(--slate)" }}>{label}</span>
      {children}
    </label>
  );
}

/* ============================================================
   ClassFormModal.jsx (component) — shared by Add & Edit
   ============================================================ */
function ClassFormModal({ mode, initialValues, onClose, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const update = (field, val) => setValues((v) => ({ ...v, [field]: val }));

  const handleSubmit = () => {
    if (!values.subjectId || !values.date || !values.startTime || !values.endTime || !values.room) {
      setError("Please fill in all required fields.");
      return;
    }
    if (values.startTime >= values.endTime) {
      setError("End time must be after start time.");
      return;
    }
    setError("");
    const subject = liveSubjects.find((s) => s.id === values.subjectId);
    onSubmit({ ...values, facultyId: subject?.facultyId ?? null });
  };

  return (
    <ModalShell title={mode === "add" ? "Add Class" : "Edit Class"} onClose={onClose} wide>
      <div className="flex flex-col gap-3">
        <FormField label="Subject">
          <select
            value={values.subjectId}
            onChange={(e) => {
              const subjectId = e.target.value;
              const subject = liveSubjects.find((s) => s.id === subjectId);
              setValues((v) => ({ ...v, subjectId, room: v.room || subject?.room || "" }));
            }}
            className="cs-input"
          >
            <option value="">Select a subject</option>
            {activeSubjects().map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Faculty">
          <p className="text-sm py-2" style={{ color: values.subjectId ? "var(--text)" : "var(--slate)" }}>
            {values.subjectId
              ? getFacultyName(liveSubjects.find((s) => s.id === values.subjectId)?.facultyId) + " (from subject)"
              : "Select a subject to see the faculty"}
          </p>
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Date">
            <input type="date" value={values.date} onChange={(e) => update("date", e.target.value)} className="cs-input" />
          </FormField>
          <FormField label="Classroom">
            <input type="text" placeholder="e.g. Room 204" value={values.room} onChange={(e) => update("room", e.target.value)} className="cs-input" />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Start Time">
            <input type="time" value={values.startTime} onChange={(e) => update("startTime", e.target.value)} className="cs-input" />
          </FormField>
          <FormField label="End Time">
            <input type="time" value={values.endTime} onChange={(e) => update("endTime", e.target.value)} className="cs-input" />
          </FormField>
        </div>
        {mode === "add" && (
          <FormField label="Class Type">
            <select value={values.classType} onChange={(e) => update("classType", e.target.value)} className="cs-input">
              <option value="regular">Regular Class</option>
              <option value="extra">Extra Class</option>
            </select>
          </FormField>
        )}
        <FormField label="Description (optional)">
          <textarea rows={2} value={values.description} onChange={(e) => update("description", e.target.value)} className="cs-input" />
        </FormField>

        {error && <p className="text-xs" style={{ color: "var(--warn)" }}>{error}</p>}

        <div className="flex gap-2 mt-2">
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--ink)", color: "#fff" }}>
            {mode === "add" ? "Add Class" : "Save Changes"}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
            Cancel
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function AddClassModal({ defaultDate, onClose, onSubmit }) {
  return (
    <ClassFormModal
      mode="add"
      initialValues={{ subjectId: "", facultyId: "", date: defaultDate, startTime: "09:00", endTime: "10:00", room: "", classType: "regular", description: "" }}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function EditClassModal({ cls, onClose, onSubmit }) {
  return (
    <ClassFormModal
      mode="edit"
      initialValues={{ subjectId: cls.subjectId || "", facultyId: cls.facultyId || "", date: cls.date, startTime: cls.startTime, endTime: cls.endTime, room: cls.room, description: cls.description || "" }}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

/* ============================================================
   RescheduleModal.jsx (component)
   ============================================================ */
function RescheduleModal({ cls, onClose, onSubmit }) {
  const [values, setValues] = useState({ date: cls.date, startTime: cls.startTime, endTime: cls.endTime, room: cls.room });
  const [error, setError] = useState("");
  const update = (field, val) => setValues((v) => ({ ...v, [field]: val }));

  const handleSubmit = () => {
    if (!values.date || !values.startTime || !values.endTime || !values.room) {
      setError("Please fill in all fields.");
      return;
    }
    if (values.startTime >= values.endTime) {
      setError("End time must be after start time.");
      return;
    }
    setError("");
    onSubmit(values);
  };

  return (
    <ModalShell title="Reschedule Class" onClose={onClose}>
      <p className="text-xs mb-3" style={{ color: "var(--slate)" }}>
        Currently: {cls.date} · {cls.startTime}–{cls.endTime} · {cls.room}
      </p>
      <div className="flex flex-col gap-3">
        <FormField label="New Date">
          <input type="date" value={values.date} onChange={(e) => update("date", e.target.value)} className="cs-input" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="New Start Time">
            <input type="time" value={values.startTime} onChange={(e) => update("startTime", e.target.value)} className="cs-input" />
          </FormField>
          <FormField label="New End Time">
            <input type="time" value={values.endTime} onChange={(e) => update("endTime", e.target.value)} className="cs-input" />
          </FormField>
        </div>
        <FormField label="New Classroom">
          <input type="text" value={values.room} onChange={(e) => update("room", e.target.value)} className="cs-input" />
        </FormField>
        {error && <p className="text-xs" style={{ color: "var(--warn)" }}>{error}</p>}
        <div className="flex gap-2 mt-2">
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--ink)", color: "#fff" }}>
            Save New Schedule
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
            Cancel
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   Toast.jsx (component)
   ============================================================ */
function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium"
      style={{ background: "var(--ink)", color: "#fff" }}
    >
      <CheckCircle2 size={15} style={{ color: "var(--gold)" }} />
      {message}
    </div>
  );
}

/* ============================================================
   ConfirmDialog.jsx (component) — a small yes/no confirmation,
   used for the "Cancel Class" confirmation step.
   ============================================================ */
function ConfirmDialog({ title, message, confirmLabel, tone, onConfirm, onBack }) {
  return (
    <ModalShell title={title} onClose={onBack}>
      <p className="text-sm mb-5" style={{ color: "var(--text)" }}>{message}</p>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-md text-sm font-medium"
          style={{ background: tone === "danger" ? "var(--warn)" : "var(--ink)", color: "#fff" }}
        >
          {confirmLabel}
        </button>
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-md text-sm font-medium"
          style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}
        >
          Go back
        </button>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   SchedulePage.jsx (component) — the `classes` timetable and
   its setter are passed down from App() so the Dashboard and
   the Schedule page share one live source of truth.
   ============================================================ */
function SchedulePage({ classes, setClasses, onNotify, pendingOpenClassId, onPendingOpenHandled, resources, onViewResources, defaultView = "Week", autoOpenAdd, onAutoOpenHandled }) {
  const [view, setView] = useState(defaultView);
  const [anchorDate, setAnchorDate] = useState(REFERENCE_TODAY);
  const [monthSelectedDate, setMonthSelectedDate] = useState(REFERENCE_TODAY);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [modal, setModal] = useState(null); // "add" | "details" | "edit" | "reschedule" | "confirm-cancel" | null
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const resolvedClasses = classes.map(resolveClass);
  // Quick action from the Control Center — opens this page's own
  // existing add modal rather than duplicating the form there.
  useEffect(() => {
    if (!autoOpenAdd) return;
    setModal("add");
    onAutoOpenHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenAdd]);

  const selectedClass = selectedClassId ? resolvedClasses.find((c) => c.id === selectedClassId) : null;
  const weekStart = startOfWeek(anchorDate);

  const rangeLabel =
    view === "Week" ? formatWeekRange(weekStart) : view === "Day" ? formatLongDate(anchorDate) : formatMonthYear(anchorDate);

  const handlePrev = () => {
    if (view === "Week") setAnchorDate(addDays(anchorDate, -7));
    else if (view === "Day") setAnchorDate(addDays(anchorDate, -1));
    else setAnchorDate(new Date(anchorDate.getFullYear(), anchorDate.getMonth() - 1, 1));
  };
  const handleNext = () => {
    if (view === "Week") setAnchorDate(addDays(anchorDate, 7));
    else if (view === "Day") setAnchorDate(addDays(anchorDate, 1));
    else setAnchorDate(new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 1));
  };
  const handleToday = () => {
    setAnchorDate(REFERENCE_TODAY);
    setMonthSelectedDate(REFERENCE_TODAY);
  };

  const openDetails = (cls) => {
    setSelectedClassId(cls.id);
    setModal("details");
  };
  const closeModal = () => {
    setModal(null);
    setSelectedClassId(null);
  };

  // A reminder toast's "View Class" button lands here from App —
  // jump straight to that class's details.
  useEffect(() => {
    if (!pendingOpenClassId) return;
    const cls = resolvedClasses.find((c) => c.id === pendingOpenClassId);
    if (cls) openDetails(cls);
    onPendingOpenHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingOpenClassId]);

  const handleAddSubmit = (values) => {
    const newClass = {
      id: `c-${Date.now()}`,
      subjectId: values.subjectId,
      facultyId: values.facultyId,
      room: values.room,
      date: values.date,
      startTime: values.startTime,
      endTime: values.endTime,
      status: values.classType === "extra" ? "extra" : "scheduled",
      description: values.description,
    };
    setClasses((prev) => [...prev, newClass]);
    setModal(null);
    showToast("Class added.");

    if (newClass.status === "extra") {
      const subjectName = getSubjectName(values.subjectId);
      onNotify({
        type: "extra_class",
        title: "Extra Class Added",
        message: `${subjectName} has been added on ${describeDate(values.date)} at ${formatTime12(values.startTime)}.`,
        relatedClassId: newClass.id,
      });
    }
  };

  const handleEditSubmit = (values) => {
    const roomChanged = selectedClass && values.room && values.room !== selectedClass.room;
    setClasses((prev) =>
      prev.map((c) =>
        c.id === selectedClassId
          ? { ...c, subjectId: values.subjectId, facultyId: values.facultyId, date: values.date, startTime: values.startTime, endTime: values.endTime, room: values.room, description: values.description }
          : c
      )
    );
    setModal(null);
    setSelectedClassId(null);
    showToast("Class updated.");

    if (roomChanged) {
      onNotify({
        type: "room_changed",
        title: "Room Changed",
        message: `${getSubjectName(values.subjectId)} has been moved from ${selectedClass.room} to ${values.room}.`,
        relatedClassId: selectedClassId,
      });
    }
  };

  const handleRequestCancel = () => {
    setModal("confirm-cancel");
  };

  const handleConfirmCancel = () => {
    const cancelled = selectedClass;
    setClasses((prev) => prev.map((c) => (c.id === selectedClassId ? { ...c, status: "cancelled" } : c)));
    setModal(null);
    setSelectedClassId(null);
    showToast("Class cancelled successfully.");

    if (cancelled) {
      onNotify({
        type: "class_cancelled",
        title: "Class Cancelled",
        message: `${cancelled.subject} has been cancelled on ${describeDate(cancelled.date)} at ${formatTime12(cancelled.startTime)}.`,
        relatedClassId: cancelled.id,
      });
    }
  };

  const handleRestoreClass = () => {
    setClasses((prev) => prev.map((c) => (c.id === selectedClassId ? { ...c, status: "scheduled" } : c)));
    setModal(null);
    setSelectedClassId(null);
    showToast("Class restored.");
  };

  const handleRescheduleSubmit = (values) => {
    const previous = selectedClass;
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== selectedClassId) return c;
        const original = c.original || { date: c.date, startTime: c.startTime, endTime: c.endTime, room: c.room };
        return { ...c, date: values.date, startTime: values.startTime, endTime: values.endTime, room: values.room, status: "rescheduled", original };
      })
    );
    setModal(null);
    setSelectedClassId(null);
    showToast("Class rescheduled.");

    if (previous) {
      onNotify({
        type: "class_rescheduled",
        title: "Class Rescheduled",
        message: `${previous.subject} has been moved ${describeMove(previous.date, previous.startTime, values.date, values.startTime)}.`,
        relatedClassId: previous.id,
      });
    }
  };

  const handleSetReminder = (minutes) => {
    setClasses((prev) => prev.map((c) => (c.id === selectedClassId ? { ...c, reminderMinutesBefore: minutes } : c)));
    showToast(minutes == null ? "Reminder removed." : `Reminder set for ${reminderLabel(minutes)} before.`);
  };

  return (
    <main className="flex-1 px-4 sm:px-8 py-6 max-w-6xl w-full mx-auto">
      <CalendarHeader
        view={view}
        onViewChange={setView}
        rangeLabel={rangeLabel}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onAddClass={() => setModal("add")}
      />

      <div
        className="mb-4 px-4 py-2.5 rounded-lg text-xs flex items-center gap-2"
        style={{ background: "var(--gold-tint)", border: "1px solid var(--gold-tint-line)", color: "var(--ink-soft)" }}
      >
        <Info size={13} /> Sample data — this timetable is for demonstration and will be replaced with your real schedule.
      </div>

      {view === "Week" && <WeekView weekStart={weekStart} classes={resolvedClasses} onSelectClass={openDetails} />}
      {view === "Day" && <DayView date={anchorDate} classes={resolvedClasses} onSelectClass={openDetails} />}
      {view === "Month" && (
        <MonthView
          anchorDate={anchorDate}
          classes={resolvedClasses}
          selectedDate={monthSelectedDate}
          onSelectDay={setMonthSelectedDate}
          onSelectClass={openDetails}
        />
      )}

      <div className="mt-5">
        <ScheduleLegend />
      </div>

      {modal === "add" && (
        <AddClassModal
          defaultDate={toISODate(view === "Day" ? anchorDate : REFERENCE_TODAY)}
          onClose={closeModal}
          onSubmit={handleAddSubmit}
        />
      )}
      {modal === "details" && selectedClass && (
        <ClassDetailsModal
          cls={selectedClass}
          onClose={closeModal}
          onEdit={() => setModal("edit")}
          onCancelClass={handleRequestCancel}
          onRestoreClass={handleRestoreClass}
          onReschedule={() => setModal("reschedule")}
          onSetReminder={handleSetReminder}
          resources={resources}
          onViewResources={onViewResources}
        />
      )}
      {modal === "confirm-cancel" && selectedClass && (
        <ConfirmDialog
          title="Cancel Class"
          message="Are you sure you want to cancel this class?"
          confirmLabel="Yes, cancel class"
          tone="danger"
          onConfirm={handleConfirmCancel}
          onBack={() => setModal("details")}
        />
      )}
      {modal === "edit" && selectedClass && (
        <EditClassModal cls={selectedClass} onClose={closeModal} onSubmit={handleEditSubmit} />
      )}
      {modal === "reschedule" && selectedClass && (
        <RescheduleModal cls={selectedClass} onClose={closeModal} onSubmit={handleRescheduleSubmit} />
      )}

      <Toast message={toast} />
    </main>
  );
}

/* ============================================================
   ComingSoonPage.jsx (component) — placeholder for pages we
   haven't built yet, so the sidebar links don't break.
   ============================================================ */
function ComingSoonPage({ label }) {
  return (
    <main className="flex-1 px-4 sm:px-8 py-10 max-w-6xl w-full mx-auto">
      <div className="cs-card p-10 text-center">
        <p className="cs-serif text-xl font-semibold mb-2" style={{ color: "var(--ink)" }}>{label}</p>
        <p className="text-sm" style={{ color: "var(--slate)" }}>This section hasn't been built yet — coming in a future step.</p>
      </div>
    </main>
  );
}

/* ================================================================
   ===============  NOTIFICATIONS & REMINDERS  ====================
   ================================================================
   Step 4. Fully separate from the Dashboard/Schedule component
   trees above — this section only adds a shared `notifications`
   list (owned by App, same pattern as the shared `classes` list)
   and the small UI pieces that read/write it.

   Notification shape:
     { id, type, title, message, date, time, read, relatedClassId }

   type: "class_cancelled" | "class_rescheduled" | "extra_class" |
         "room_changed" | "new_notes" | "assignment" | "class_reminder"
   ================================================================ */

const TODAY_ISO = toISODate(REFERENCE_TODAY);
const YESTERDAY_ISO = toISODate(addDays(REFERENCE_TODAY, -1));
const TOMORROW_ISO = toISODate(addDays(REFERENCE_TODAY, 1));
// Small convenience for seeding sample data relative to "today".
const addDaysISO = (n) => toISODate(addDays(REFERENCE_TODAY, n));

function formatClockTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}
function formatTime12(hhmm) {
  const minutes = timeToMinutes(hhmm);
  if (livePreferences.timeFormat === "24h") {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  return formatClockTime(minutes);
}
function describeDate(iso) {
  if (iso === TODAY_ISO) return "today";
  if (iso === TOMORROW_ISO) return "tomorrow";
  if (iso === YESTERDAY_ISO) return "yesterday";
  return formatDayNum(parseISODate(iso));
}
function describeMove(oldIso, oldTime, newIso, newTime) {
  if (oldIso === newIso) return `from ${formatTime12(oldTime)} to ${formatTime12(newTime)}`;
  return `from ${describeDate(oldIso)} ${formatTime12(oldTime)} to ${describeDate(newIso)} ${formatTime12(newTime)}`;
}
function formatNotifWhen(n) {
  if (n.date === TODAY_ISO) return `Today · ${n.time}`;
  if (n.date === YESTERDAY_ISO) return `Yesterday · ${n.time}`;
  return `${describeDate(n.date)} · ${n.time}`;
}

/* ------------------------------------------------------------
   Notification type metadata — single source of truth for
   how each type is labeled and colored (mirrors STATUS_META).
   ------------------------------------------------------------ */
const NOTIF_TYPE_META = {
  class_cancelled: { emoji: "🔴", label: "Class Cancelled", color: "var(--warn)" },
  class_rescheduled: { emoji: "🟡", label: "Class Rescheduled", color: "var(--resched)" },
  extra_class: { emoji: "🟣", label: "Extra Class Added", color: "var(--extra)" },
  room_changed: { emoji: "🔵", label: "Room Changed", color: "var(--info)" },
  new_notes: { emoji: "🟢", label: "New Notes", color: "var(--good)" },
  assignment: { emoji: "🟠", label: "Assignment", color: "#B8542F" },
  class_reminder: { emoji: "🔔", label: "Class Reminder", color: "var(--gold)" },
  announcement: { emoji: "📢", label: "New Announcement", color: "var(--info)" },
  urgent_announcement: { emoji: "🔴", label: "Urgent Announcement", color: "var(--warn)" },
  calendar_event: { emoji: "📅", label: "Academic Event Today", color: "var(--extra)" },
};

// Only these types count as "important" enough for the Dashboard's
// Important Updates card — routine items like new_notes are left
// out on purpose so that card doesn't just mirror the full list.
const IMPORTANT_NOTIF_TYPES = ["class_cancelled", "class_rescheduled", "extra_class", "urgent_announcement"];

/* ------------------------------------------------------------
   SAMPLE seed notifications — a small, realistic starting
   inbox. New notifications created from Schedule actions are
   added on top of these at runtime (see App()).
   `relatedClassId` ties a notification back to a class in
   `scheduleDemoData` where relevant.
   ------------------------------------------------------------ */
const initialNotifications = [
  { id: "n1", type: "class_cancelled", title: "Class Cancelled", message: "Operating Systems has been cancelled today at 1:00 PM.", date: TODAY_ISO, time: "9:05 AM", read: false, relatedClassId: "s17" },
  { id: "n5", type: "class_rescheduled", title: "Class Rescheduled", message: "Database Management Systems has been moved from 9:00 AM to 11:00 AM.", date: TODAY_ISO, time: "8:10 AM", read: false, relatedClassId: "s20" },
  { id: "n4", type: "extra_class", title: "Extra Class Added", message: "Software Engineering Lab has been added on today at 1:00 PM.", date: TODAY_ISO, time: "8:00 AM", read: false, relatedClassId: "s21" },
  { id: "n3", type: "new_notes", title: "New Notes", message: "New notes have been uploaded for Computer Networks.", date: YESTERDAY_ISO, time: "6:15 PM", read: true, relatedClassId: null },
  { id: "n2", type: "room_changed", title: "Room Changed", message: "Database Management Systems has been moved from Room 204 to Room 301.", date: YESTERDAY_ISO, time: "4:30 PM", read: true, relatedClassId: null },
];

/* ============================================================
   NotificationItem.jsx (component)
   ============================================================ */
function NotificationItem({ notification, onMarkRead }) {
  const meta = NOTIF_TYPE_META[notification.type] || { emoji: "🔔", color: "var(--ink-soft)" };
  return (
    <div
      className="flex gap-3 px-4 py-3"
      style={{ borderBottom: "1px solid var(--line)", background: notification.read ? "transparent" : "var(--gold-tint)" }}
    >
      <span className="text-base flex-shrink-0 leading-none mt-0.5">{meta.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{notification.title}</p>
          {!notification.read && <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: "var(--gold)" }} />}
        </div>
        <p className="text-xs mt-0.5 leading-snug" style={{ color: "var(--text)" }}>{notification.message}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[11px]" style={{ color: "var(--slate)" }}>{formatNotifWhen(notification)}</span>
          {!notification.read && (
            <button onClick={onMarkRead} className="text-[11px] font-medium" style={{ color: "var(--gold)" }}>
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   NotificationCenter.jsx (component) — the dropdown panel
   opened from the header's bell.
   ============================================================ */
function NotificationCenter({ notifications, onMarkRead, onMarkAllRead, onClose }) {
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[55]" />
      <div
        className="fixed top-[64px] right-4 sm:right-8 z-[56] w-[340px] max-w-[calc(100vw-2rem)] cs-card max-h-[70vh] overflow-y-auto cs-scroll"
        style={{ background: "var(--panel)" }}
      >
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--line)" }}>
          <h3 className="cs-serif text-base font-semibold" style={{ color: "var(--ink)" }}>Notifications</h3>
          <button onClick={onMarkAllRead} className="text-xs font-medium" style={{ color: "var(--gold)" }}>
            Mark all as read
          </button>
        </div>
        {notifications.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: "var(--slate)" }}>No notifications yet.</p>
        ) : (
          <div>
            {notifications.map((n) => (
              <NotificationItem key={n.id} notification={n} onMarkRead={() => onMarkRead(n.id)} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ============================================================
   ImportantUpdatesCard.jsx (component) — Dashboard section.
   Only class_cancelled / class_rescheduled / extra_class show
   up here, and only the most recent few — everything else
   (new_notes, room_changed, …) stays in the full notification
   center so this card doesn't just duplicate it.
   ============================================================ */
function ImportantUpdatesCard({ notifications }) {
  const important = notifications.filter((n) => IMPORTANT_NOTIF_TYPES.includes(n.type)).slice(0, 4);
  return (
    <div className="cs-card p-5 sm:p-6 mb-5">
      <h2 className="cs-serif text-lg font-semibold mb-3" style={{ color: "var(--ink)" }}>
        Important Updates
      </h2>
      {important.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--slate)" }}>No important updates</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {important.map((n) => {
            const meta = NOTIF_TYPE_META[n.type];
            return (
              <div key={n.id} className="flex items-start gap-2.5">
                <span className="text-sm flex-shrink-0 leading-none mt-0.5">{meta.emoji}</span>
                <p className="text-sm" style={{ color: "var(--text)" }}>{n.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ReminderToast.jsx (component) — the "upcoming class" alert.
   Purely local/demo: it checks a fixed reference "now" against
   each class's reminder offset (see findDueReminder in App()).
   ============================================================ */
function ReminderToast({ cls, onView, onDismiss }) {
  if (!cls) return null;
  return (
    <div
      className="fixed bottom-6 right-4 sm:right-8 z-[80] cs-card p-4 w-[300px] max-w-[calc(100vw-2rem)]"
      style={{ background: "var(--panel)" }}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "var(--ink)" }}>
          <Bell size={14} style={{ color: "var(--gold)" }} /> Upcoming Class
        </p>
        <button onClick={onDismiss} style={{ color: "var(--slate)" }} aria-label="Dismiss">
          <X size={14} />
        </button>
      </div>
      <p className="text-sm" style={{ color: "var(--text)" }}>
        {cls.subject} starts in {cls.reminderMinutesBefore} minutes.
      </p>
      <p className="text-xs mt-1" style={{ color: "var(--slate)" }}>{cls.room} · {cls.faculty}</p>
      <button
        onClick={onView}
        className="mt-3 text-xs font-medium px-3 py-1.5 rounded-md"
        style={{ background: "var(--ink)", color: "#fff" }}
      >
        View Class
      </button>
    </div>
  );
}

// Finds a today's class whose reminder window has opened (demo
// "now" has passed the reminder trigger time but the class
// hasn't started yet) and hasn't already been shown/dismissed.
function findDueReminder(classes, dismissedIds) {
  if (!livePreferences.remindersEnabled) return null;
  const due = classes
    .filter((c) => c.date === TODAY_ISO && c.reminderMinutesBefore != null && c.status !== "cancelled" && !dismissedIds.has(c.id))
    .map(resolveClass)
    .find((c) => {
      const startMin = timeToMinutes(c.startTime);
      const triggerMin = startMin - c.reminderMinutesBefore;
      return REFERENCE_NOW_MINUTES >= triggerMin && REFERENCE_NOW_MINUTES < startMin;
    });
  return due || null;
}

/* ================================================================
   ==================  NOTES & RESOURCES  ==========================
   ================================================================
   Step 5. Fully separate from Dashboard/Schedule/Notifications —
   this section adds a shared `resources` list (owned by App, same
   pattern as `classes` and `notifications`) plus the page and
   modals that read/write it, and a small connector used by the
   Schedule page's Class Details modal.

   Resource shape:
     { id, name, subjectId, lectureId, classId, date, type,
       uploadedBy, uploaderName, description, fileName,
       fileSizeLabel, fileObjectUrl, linkUrl, noteContent, bookmarked }

   type: "pdf" | "ppt" | "document" | "image" | "link" | "personal_note"
   uploadedBy: "faculty" | "student" ("student" = the current demo
   user, "You" — only their own resources can be deleted)
   ================================================================ */

const RESOURCE_TYPE_META = {
  pdf: { emoji: "📄", label: "PDF" },
  ppt: { emoji: "📊", label: "PPT" },
  document: { emoji: "📃", label: "Document" },
  image: { emoji: "📷", label: "Image" },
  link: { emoji: "🔗", label: "Link" },
  personal_note: { emoji: "📝", label: "Personal Note" },
};

// SAMPLE lectures — one small master list resources attach to,
// same normalized pattern as the centralized subjects. A few
// are tied to real Schedule classes via classId so the Class
// Details connection has something real to show.
const lecturesDemoData = [
  { id: "lec-dbms-1", subjectId: "sub-dbms", date: "2026-09-10", title: "ER Model & Relational Design", facultyId: "fac-iyer", room: "Room 210", classId: "s20" },
  { id: "lec-dbms-2", subjectId: "sub-dbms", date: "2026-09-08", title: "Normalization", facultyId: "fac-iyer", room: "Room 204", classId: null },
  { id: "lec-cn-1", subjectId: "sub-cn", date: "2026-09-10", title: "Routing Algorithms", facultyId: "fac-menon", room: "Room 108", classId: "s16" },
  { id: "lec-dsa-1", subjectId: "sub-dsa", date: "2026-09-10", title: "Binary Search Trees", facultyId: "fac-nair", room: "Room 204", classId: "s14" },
  { id: "lec-os-1", subjectId: "sub-os", date: "2026-09-09", title: "Process Scheduling", facultyId: "fac-kulkarni", room: "Room 108", classId: null },
  { id: "lec-se-1", subjectId: "sub-se", date: "2026-09-10", title: "Requirements Gathering Lab", facultyId: "fac-rao", room: "Lab 3", classId: "s18" },
];

// SAMPLE resources.
const resourcesDemoData = [
  { id: "r1", name: "ER Diagram Lecture Slides", subjectId: "sub-dbms", lectureId: "lec-dbms-1", classId: "s20", date: "2026-09-10", type: "ppt", uploadedBy: "faculty", uploaderName: "Prof. Iyer", description: "Slides covering ER modeling and relational schema design.", fileName: "er-model-lecture.pptx", fileSizeLabel: "3.1 MB", bookmarked: false },
  { id: "r2", name: "ER Diagram Class Notes", subjectId: "sub-dbms", lectureId: "lec-dbms-1", classId: "s20", date: "2026-09-10", type: "personal_note", uploadedBy: "student", uploaderName: "You", description: "", noteContent: "Key takeaways: 1NF/2NF/3NF recap, ER → relational mapping steps.", bookmarked: true },
  { id: "r3", name: "Board Photos — ER Diagrams", subjectId: "sub-dbms", lectureId: "lec-dbms-1", classId: "s20", date: "2026-09-10", type: "image", uploadedBy: "student", uploaderName: "You", description: "Photos of the whiteboard ER diagrams from class.", fileName: "board-photo-1.jpg", fileSizeLabel: "1.8 MB", bookmarked: false },
  { id: "r4", name: "Additional Reading — Normalization Guide", subjectId: "sub-dbms", lectureId: "lec-dbms-1", classId: "s20", date: "2026-09-10", type: "link", uploadedBy: "faculty", uploaderName: "Prof. Iyer", description: "External article with more normalization examples.", linkUrl: "https://example.com/normalization-guide", bookmarked: false },
  { id: "r5", name: "Normalization Lecture Slides", subjectId: "sub-dbms", lectureId: "lec-dbms-2", classId: null, date: "2026-09-08", type: "ppt", uploadedBy: "faculty", uploaderName: "Prof. Iyer", description: "1NF, 2NF, 3NF, BCNF with examples.", fileName: "normalization.pptx", fileSizeLabel: "2.4 MB", bookmarked: false },
  { id: "r6", name: "Normalization Student Notes", subjectId: "sub-dbms", lectureId: "lec-dbms-2", classId: null, date: "2026-09-08", type: "document", uploadedBy: "student", uploaderName: "You", description: "Handwritten notes typed up after class.", fileName: "normalization-notes.docx", fileSizeLabel: "420 KB", bookmarked: false },
  { id: "r7", name: "Routing Algorithms Lecture PPT", subjectId: "sub-cn", lectureId: "lec-cn-1", classId: "s16", date: "2026-09-10", type: "ppt", uploadedBy: "faculty", uploaderName: "Dr. Menon", description: "Distance vector vs. link state routing.", fileName: "routing-algorithms.pptx", fileSizeLabel: "2.9 MB", bookmarked: false },
  { id: "r8", name: "Routing Class Notes", subjectId: "sub-cn", lectureId: "lec-cn-1", classId: "s16", date: "2026-09-10", type: "personal_note", uploadedBy: "student", uploaderName: "You", description: "", noteContent: "Dijkstra vs. Bellman-Ford, RIP vs. OSPF comparison.", bookmarked: false },
  { id: "r9", name: "Binary Search Trees Notes", subjectId: "sub-dsa", lectureId: "lec-dsa-1", classId: "s14", date: "2026-09-10", type: "document", uploadedBy: "faculty", uploaderName: "Dr. Nair", description: "BST operations and balancing intuition.", fileName: "bst-notes.pdf", fileSizeLabel: "1.1 MB", bookmarked: true },
  { id: "r10", name: "BST Practice Problems", subjectId: "sub-dsa", lectureId: "lec-dsa-1", classId: "s14", date: "2026-09-10", type: "pdf", uploadedBy: "faculty", uploaderName: "Dr. Nair", description: "Practice set for insert/delete/traversal.", fileName: "bst-practice.pdf", fileSizeLabel: "640 KB", bookmarked: false },
  { id: "r11", name: "Process Scheduling Slides", subjectId: "sub-os", lectureId: "lec-os-1", classId: null, date: "2026-09-09", type: "pdf", uploadedBy: "faculty", uploaderName: "Dr. Kulkarni", description: "FCFS, SJF, Round Robin, Priority scheduling.", fileName: "process-scheduling.pdf", fileSizeLabel: "1.6 MB", bookmarked: false },
  { id: "r12", name: "Requirements Doc Template", subjectId: "sub-se", lectureId: "lec-se-1", classId: "s18", date: "2026-09-10", type: "document", uploadedBy: "faculty", uploaderName: "Prof. Rao", description: "Template used for the SRS assignment.", fileName: "srs-template.docx", fileSizeLabel: "280 KB", bookmarked: false },
];

/* ------------------------------------------------------------
   Helpers
   ------------------------------------------------------------ */
function relativeFromToday(iso) {
  const diffDays = Math.round((REFERENCE_TODAY - parseISODate(iso)) / 86400000);
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  return `${diffDays} days ago`;
}
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function getSubjectStats(subjectId, resources) {
  const lectureCount = lecturesDemoData.filter((l) => l.subjectId === subjectId).length;
  const subjectResources = resources.filter((r) => r.subjectId === subjectId);
  const lastDate = subjectResources.reduce((max, r) => (!max || r.date > max ? r.date : max), null);
  return {
    lectureCount,
    resourceCount: subjectResources.length,
    lastUpdatedLabel: lastDate ? relativeFromToday(lastDate) : null,
  };
}
function matchesQuery(r, q) {
  if (!q || !q.trim()) return true;
  const lecture = r.lectureId ? lecturesDemoData.find((l) => l.id === r.lectureId) : null;
  const haystack = [r.name, getSubjectName(r.subjectId), lecture?.title, r.uploaderName].filter(Boolean).join(" ").toLowerCase();
  return haystack.includes(q.trim().toLowerCase());
}
function matchesDateFilter(r, filterDate) {
  if (filterDate === "all") return true;
  const weekStartIso = toISODate(CURRENT_WEEK_START);
  const weekEndIso = toISODate(addDays(CURRENT_WEEK_START, 6));
  if (filterDate === "today") return r.date === TODAY_ISO;
  if (filterDate === "week") return r.date >= weekStartIso && r.date <= weekEndIso;
  if (filterDate === "older") return r.date < weekStartIso;
  return true;
}
// Used by the Schedule page's Class Details modal: prefer resources
// tied to this exact class instance, otherwise fall back to anything
// filed under the same subject.
function getClassResources(cls, resources) {
  const byClass = resources.filter((r) => r.classId === cls.id);
  if (byClass.length > 0) return byClass;
  if (!cls.subjectId) return [];
  return resources.filter((r) => r.subjectId === cls.subjectId);
}

/* ============================================================
   BookmarkButton.jsx (component)
   ============================================================ */
function BookmarkButton({ bookmarked, onToggle, size = 15 }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label="Bookmark"
      className="flex-shrink-0"
    >
      <Bookmark size={size} style={{ color: "var(--gold)" }} fill={bookmarked ? "var(--gold)" : "none"} />
    </button>
  );
}

/* ============================================================
   ResourceCard.jsx (component)
   ============================================================ */
function ResourceCard({ resource, onClick, onToggleBookmark, showContext }) {
  const meta = RESOURCE_TYPE_META[resource.type];
  const isNote = resource.type === "personal_note";
  const lecture = resource.lectureId ? lecturesDemoData.find((l) => l.id === resource.lectureId) : null;
  return (
    <button
      onClick={() => onClick(resource)}
      className="cs-card w-full text-left p-3.5 flex items-start gap-3"
      style={isNote ? { background: "var(--extra-tint)", borderColor: "#D9D0EC" } : {}}
    >
      <span className="text-lg flex-shrink-0 leading-none mt-0.5">{meta.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug" style={{ color: "var(--ink)" }}>{resource.name}</p>
          <BookmarkButton bookmarked={resource.bookmarked} onToggle={() => onToggleBookmark(resource.id)} />
        </div>
        {showContext && (
          <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--slate)" }}>
            {getSubjectName(resource.subjectId)}{lecture ? ` · ${lecture.title}` : ""}
          </p>
        )}
        <p className="text-[11px] mt-0.5" style={{ color: "var(--slate)" }}>
          {meta.label}{resource.fileSizeLabel ? ` · ${resource.fileSizeLabel}` : ""} · {resource.uploaderName} · {formatDayNum(parseISODate(resource.date))}
        </p>
      </div>
    </button>
  );
}

/* ============================================================
   SubjectCard.jsx (component)
   ============================================================ */
function SubjectCard({ subject, stats, onClick }) {
  return (
    <button onClick={onClick} className="cs-card p-5 text-left">
      <p className="cs-serif text-base font-semibold mb-2" style={{ color: "var(--ink)" }}>{subject.name}</p>
      <div className="flex items-center gap-4 text-xs" style={{ color: "var(--slate)" }}>
        <span>{stats.lectureCount} lecture{stats.lectureCount !== 1 ? "s" : ""}</span>
        <span>{stats.resourceCount} resource{stats.resourceCount !== 1 ? "s" : ""}</span>
      </div>
      <p className="text-xs mt-2" style={{ color: "var(--slate)" }}>
        {stats.lastUpdatedLabel ? `Last updated ${stats.lastUpdatedLabel}` : "No resources yet"}
      </p>
    </button>
  );
}

/* ============================================================
   LectureSection.jsx (component)
   ============================================================ */
function LectureSection({ lecture, resources, onOpenResource, onToggleBookmark }) {
  const facultyName = lecture.facultyId ? getFacultyName(lecture.facultyId) : null;
  return (
    <div className="mb-6">
      <div className="mb-2.5">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--gold)" }}>
          {formatLongDate(parseISODate(lecture.date))}
        </p>
        <p className="cs-serif text-base font-semibold" style={{ color: "var(--ink)" }}>{lecture.title}</p>
        {facultyName && (
          <p className="text-xs mt-0.5" style={{ color: "var(--slate)" }}>Faculty: {facultyName} · Classroom: {lecture.room}</p>
        )}
      </div>
      {resources.length === 0 ? (
        <p className="text-xs" style={{ color: "var(--slate)" }}>No resources for this lecture yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {resources.map((r) => (
            <ResourceCard key={r.id} resource={r} onClick={onOpenResource} onToggleBookmark={onToggleBookmark} showContext={false} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   NotesEmptyState.jsx (component)
   ============================================================ */
function NotesEmptyState({ onClear, message = "No resources found" }) {
  return (
    <div className="cs-card p-10 text-center">
      <p className="text-sm font-medium mb-3" style={{ color: "var(--ink)" }}>{message}</p>
      <button
        onClick={onClear}
        className="text-xs font-medium px-3 py-1.5 rounded-md"
        style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}
      >
        Clear Filters
      </button>
    </div>
  );
}

/* ============================================================
   NotesSearch.jsx (component)
   ============================================================ */
function NotesSearch({ value, onChange, placeholder = "Search notes, subjects, lectures…" }) {
  return (
    <div className="cs-card flex items-center gap-2 px-3.5 py-2.5 flex-1 min-w-[200px]">
      <Search size={15} style={{ color: "var(--slate)" }} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none text-sm w-full"
        style={{ color: "var(--text)" }}
      />
    </div>
  );
}

/* ============================================================
   NotesFilters.jsx (component) — wraps onto multiple lines on
   narrow screens so it stays usable without a separate dropdown.
   ============================================================ */
function NotesFilters({ subjectId, onSubjectChange, type, onTypeChange, date, onDateChange, bookmarkedOnly, onBookmarkedToggle, isFiltering, onClear }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select value={subjectId} onChange={(e) => onSubjectChange(e.target.value)} className="cs-input" style={{ width: "auto" }}>
        <option value="all">All Subjects</option>
        {activeSubjects().map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
      <select value={type} onChange={(e) => onTypeChange(e.target.value)} className="cs-input" style={{ width: "auto" }}>
        <option value="all">All Types</option>
        {Object.entries(RESOURCE_TYPE_META).map(([key, meta]) => (
          <option key={key} value={key}>{meta.label}</option>
        ))}
      </select>
      <select value={date} onChange={(e) => onDateChange(e.target.value)} className="cs-input" style={{ width: "auto" }}>
        <option value="all">All Dates</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="older">Older</option>
      </select>
      <button
        onClick={onBookmarkedToggle}
        className="px-3 py-2 rounded-md text-xs font-medium flex items-center gap-1.5"
        style={{
          background: bookmarkedOnly ? "var(--gold)" : "var(--panel)",
          color: bookmarkedOnly ? "#fff" : "var(--ink-soft)",
          border: "1px solid var(--line)",
        }}
      >
        <Bookmark size={13} fill={bookmarkedOnly ? "#fff" : "none"} /> Bookmarked
      </button>
      {isFiltering && (
        <button onClick={onClear} className="text-xs font-medium" style={{ color: "var(--warn)" }}>
          Clear Filters
        </button>
      )}
    </div>
  );
}

/* ============================================================
   RecentlyAddedCard.jsx (component)
   ============================================================ */
function RecentlyAddedCard({ resources, onOpenResource }) {
  const recent = [...resources].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 4);
  if (recent.length === 0) return null;
  return (
    <div className="cs-card p-5 sm:p-6 mb-5">
      <h2 className="cs-serif text-base font-semibold mb-3" style={{ color: "var(--ink)" }}>Recently Added</h2>
      <div className="flex flex-col gap-2.5">
        {recent.map((r) => {
          const meta = RESOURCE_TYPE_META[r.type];
          return (
            <button key={r.id} onClick={() => onOpenResource(r)} className="flex items-center gap-2.5 text-left">
              <span className="text-base flex-shrink-0">{meta.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: "var(--text)" }}>
                  {meta.label} — {getSubjectName(r.subjectId)}
                </p>
                <p className="text-[11px]" style={{ color: "var(--slate)" }}>{relativeFromToday(r.date)}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   ResourceDetailsModal.jsx (component)
   ============================================================ */
function ResourceDetailsModal({ resource, onClose, onToggleBookmark, onDelete, onNotice }) {
  const meta = RESOURCE_TYPE_META[resource.type];
  const lecture = resource.lectureId ? lecturesDemoData.find((l) => l.id === resource.lectureId) : null;
  const canDelete = resource.uploadedBy === "student";
  const hasRealFile = !!resource.fileObjectUrl;

  const handleView = () => {
    if (resource.type === "link") {
      window.open(resource.linkUrl, "_blank", "noopener,noreferrer");
    } else if (hasRealFile) {
      window.open(resource.fileObjectUrl, "_blank", "noopener,noreferrer");
    } else {
      onNotice("This is sample data — no real file is attached yet.");
    }
  };
  const handleDownload = () => {
    if (hasRealFile) {
      const a = document.createElement("a");
      a.href = resource.fileObjectUrl;
      a.download = resource.fileName || resource.name;
      a.click();
    } else {
      onNotice("This is sample data — no real file is attached yet.");
    }
  };

  return (
    <ModalShell title="Resource Details" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <DetailRow label="Name" value={resource.name} />
        <DetailRow label="Subject" value={getSubjectName(resource.subjectId)} />
        <DetailRow label="Lecture" value={lecture ? `${lecture.title} · ${formatDayNum(parseISODate(lecture.date))}` : "General"} />
        <DetailRow label="Uploaded by" value={resource.uploaderName} />
        <DetailRow label="Date" value={formatLongDate(parseISODate(resource.date))} />
        <DetailRow label="Type" value={`${meta.emoji} ${meta.label}${resource.fileSizeLabel ? ` · ${resource.fileSizeLabel}` : ""}`} />
        <DetailRow label="Description" value={resource.description || resource.noteContent || "—"} />
      </div>

      <div className="flex flex-wrap gap-2 mt-5 pt-4" style={{ borderTop: "1px solid var(--line)" }}>
        {resource.type === "link" ? (
          <button onClick={handleView} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium" style={{ background: "var(--info-tint)", color: "var(--info)" }}>
            <ExternalLink size={13} /> Open Link
          </button>
        ) : resource.type !== "personal_note" ? (
          <>
            <button onClick={handleView} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium" style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
              <Eye size={13} /> View
            </button>
            <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium" style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
              <Download size={13} /> Download
            </button>
          </>
        ) : null}
        <button
          onClick={() => onToggleBookmark(resource.id)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium"
          style={{ background: "var(--gold-tint)", color: "#8A6A1F" }}
        >
          <Bookmark size={13} fill={resource.bookmarked ? "#8A6A1F" : "none"} /> {resource.bookmarked ? "Bookmarked" : "Bookmark"}
        </button>
        {canDelete && (
          <button onClick={() => onDelete(resource.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium" style={{ background: "var(--warn-tint)", color: "var(--warn)" }}>
            <Trash2 size={13} /> Delete
          </button>
        )}
      </div>
    </ModalShell>
  );
}

/* ============================================================
   UploadResourceModal.jsx (component)
   ============================================================ */
function UploadResourceModal({ onClose, onSubmit }) {
  const [values, setValues] = useState({ name: "", subjectId: "", lectureId: "", type: "pdf", description: "", linkUrl: "", noteContent: "" });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const update = (field, val) => setValues((v) => ({ ...v, [field]: val }));
  const lectureOptions = values.subjectId ? lecturesDemoData.filter((l) => l.subjectId === values.subjectId) : [];

  const handleSubmit = () => {
    if (!values.name || !values.subjectId || !values.type) {
      setError("Please fill in all required fields.");
      return;
    }
    if (values.type === "link" && !values.linkUrl) {
      setError("Please add a link URL.");
      return;
    }
    if (values.type === "personal_note" && !values.noteContent) {
      setError("Please add some note content.");
      return;
    }
    setError("");
    onSubmit({ ...values, file });
  };

  return (
    <ModalShell title="Upload Resource" onClose={onClose} wide>
      <div className="flex flex-col gap-3">
        <FormField label="Resource Name">
          <input type="text" value={values.name} onChange={(e) => update("name", e.target.value)} className="cs-input" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Subject">
            <select
              value={values.subjectId}
              onChange={(e) => {
                update("subjectId", e.target.value);
                update("lectureId", "");
              }}
              className="cs-input"
            >
              <option value="">Select a subject</option>
              {activeSubjects().map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Lecture / Class (optional)">
            <select value={values.lectureId} onChange={(e) => update("lectureId", e.target.value)} className="cs-input" disabled={!values.subjectId}>
              <option value="">General (no specific lecture)</option>
              {lectureOptions.map((l) => (
                <option key={l.id} value={l.id}>{formatDayNum(parseISODate(l.date))} — {l.title}</option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField label="Resource Type">
          <select value={values.type} onChange={(e) => update("type", e.target.value)} className="cs-input">
            {Object.entries(RESOURCE_TYPE_META).map(([key, meta]) => (
              <option key={key} value={key}>{meta.label}</option>
            ))}
          </select>
        </FormField>

        {values.type === "link" && (
          <FormField label="Link URL">
            <input type="text" placeholder="https://…" value={values.linkUrl} onChange={(e) => update("linkUrl", e.target.value)} className="cs-input" />
          </FormField>
        )}
        {values.type === "personal_note" && (
          <FormField label="Note Content">
            <textarea rows={4} value={values.noteContent} onChange={(e) => update("noteContent", e.target.value)} className="cs-input" />
          </FormField>
        )}
        {["pdf", "ppt", "document", "image"].includes(values.type) && (
          <FormField label="File (optional)">
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="cs-input" />
          </FormField>
        )}
        <p className="text-[11px]" style={{ color: "var(--slate)" }}>
          Files only stay in this browser tab for this session — nothing is uploaded to a server. This form is ready to connect to real storage (e.g. Supabase Storage) later.
        </p>

        <FormField label="Description (optional)">
          <textarea rows={2} value={values.description} onChange={(e) => update("description", e.target.value)} className="cs-input" />
        </FormField>

        {error && <p className="text-xs" style={{ color: "var(--warn)" }}>{error}</p>}

        <div className="flex gap-2 mt-2">
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--ink)", color: "#fff" }}>
            Upload Resource
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
            Cancel
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   PersonalNoteModal.jsx (component)
   ============================================================ */
function PersonalNoteModal({ onClose, onSubmit }) {
  const [values, setValues] = useState({ title: "", subjectId: "", lectureId: "", content: "" });
  const [error, setError] = useState("");
  const update = (field, val) => setValues((v) => ({ ...v, [field]: val }));
  const lectureOptions = values.subjectId ? lecturesDemoData.filter((l) => l.subjectId === values.subjectId) : [];

  const handleSubmit = () => {
    if (!values.title || !values.subjectId || !values.content) {
      setError("Please fill in the title, subject, and note content.");
      return;
    }
    setError("");
    onSubmit(values);
  };

  return (
    <ModalShell title="New Personal Note" onClose={onClose} wide>
      <div className="flex flex-col gap-3">
        <FormField label="Title">
          <input type="text" value={values.title} onChange={(e) => update("title", e.target.value)} className="cs-input" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Subject">
            <select
              value={values.subjectId}
              onChange={(e) => {
                update("subjectId", e.target.value);
                update("lectureId", "");
              }}
              className="cs-input"
            >
              <option value="">Select a subject</option>
              {activeSubjects().map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Lecture (optional)">
            <select value={values.lectureId} onChange={(e) => update("lectureId", e.target.value)} className="cs-input" disabled={!values.subjectId}>
              <option value="">General</option>
              {lectureOptions.map((l) => (
                <option key={l.id} value={l.id}>{formatDayNum(parseISODate(l.date))} — {l.title}</option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField label="Note Content">
          <textarea rows={5} value={values.content} onChange={(e) => update("content", e.target.value)} className="cs-input" />
        </FormField>
        {error && <p className="text-xs" style={{ color: "var(--warn)" }}>{error}</p>}
        <div className="flex gap-2 mt-2">
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--ink)", color: "#fff" }}>
            Save Note
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
            Cancel
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   ClassResourcesSection.jsx (component) — embedded inside the
   Schedule page's ClassDetailsModal.
   ============================================================ */
function ClassResourcesSection({ cls, resources, onViewResources }) {
  const related = getClassResources(cls, resources);
  const preview = related.slice(0, 3);
  return (
    <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--line)" }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--slate)" }}>Class Resources</p>
        <span className="text-xs" style={{ color: "var(--slate)" }}>{related.length} Resource{related.length !== 1 ? "s" : ""}</span>
      </div>
      {preview.length === 0 ? (
        <p className="text-xs mb-2" style={{ color: "var(--slate)" }}>No resources yet for this class.</p>
      ) : (
        <div className="flex flex-col gap-1.5 mb-2">
          {preview.map((r) => (
            <p key={r.id} className="text-xs flex items-center gap-1.5" style={{ color: "var(--text)" }}>
              <span>{RESOURCE_TYPE_META[r.type].emoji}</span> {r.name}
            </p>
          ))}
        </div>
      )}
      {cls.subjectId && (
        <button
          onClick={() => onViewResources(cls.subjectId)}
          className="text-xs font-medium flex items-center gap-1"
          style={{ color: "var(--gold)" }}
        >
          View All Resources <ArrowUpRight size={12} />
        </button>
      )}
    </div>
  );
}

/* ============================================================
   NotesPage.jsx (component) — owns filters/search/modal state
   for the Notes & Resources page. `resources`/`setResources`
   are passed down from App, the same shared-state pattern as
   `classes` and `notifications`.
   ============================================================ */
function NotesPage({ resources, setResources, pendingSubjectId, onPendingHandled, autoOpenAdd, onAutoOpenHandled, pendingOpenResourceId, onPendingOpenResourceHandled }) {
  const [query, setQuery] = useState("");
  const [filterSubjectId, setFilterSubjectId] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [modal, setModal] = useState(null); // "upload" | "note" | "details" | null
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // Arriving here via "View All Resources →" from a class's
  // details modal — preset the subject filter to match.
  useEffect(() => {
    if (!pendingSubjectId) return;
    setFilterSubjectId(pendingSubjectId);
    setSelectedSubjectId(null);
    setQuery("");
    onPendingHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSubjectId]);

  const isFiltering = query.trim() !== "" || filterSubjectId !== "all" || filterType !== "all" || filterDate !== "all" || bookmarkedOnly;
  // Quick action from the Control Center — opens this page's own
  // existing add modal rather than duplicating the form there.
  useEffect(() => {
    if (!autoOpenAdd) return;
    setModal("upload");
    onAutoOpenHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenAdd]);


  const filteredResources = resources.filter(
    (r) =>
      matchesQuery(r, query) &&
      (filterSubjectId === "all" || r.subjectId === filterSubjectId) &&
      (filterType === "all" || r.type === filterType) &&
      matchesDateFilter(r, filterDate) &&
      (!bookmarkedOnly || r.bookmarked)
  );

  const clearFilters = () => {
    setQuery("");
    setFilterSubjectId("all");
    setFilterType("all");
    setFilterDate("all");
    setBookmarkedOnly(false);
  };

  const openResource = (r) => {
    setSelectedResourceId(r.id);
    setModal("details");
  };
  const closeModal = () => {
    setModal(null);
    setSelectedResourceId(null);
  };
  const selectedResource = selectedResourceId ? resources.find((r) => r.id === selectedResourceId) : null;

  // Jumped here from Global Search to view one specific resource —
  // opens the same details modal this page already has.
  useEffect(() => {
    if (!pendingOpenResourceId) return;
    const r = resources.find((x) => x.id === pendingOpenResourceId);
    if (r) openResource(r);
    onPendingOpenResourceHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingOpenResourceId]);

  const handleToggleBookmark = (id) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, bookmarked: !r.bookmarked } : r)));
  };
  const handleDelete = (id) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    closeModal();
    showToast("Resource deleted.");
  };
  const handleUploadSubmit = (values) => {
    const lecture = values.lectureId ? lecturesDemoData.find((l) => l.id === values.lectureId) : null;
    const base = {
      id: `r-${Date.now()}`,
      name: values.name,
      subjectId: values.subjectId,
      lectureId: values.lectureId || null,
      classId: lecture?.classId ?? null,
      date: TODAY_ISO,
      type: values.type,
      uploadedBy: "student",
      uploaderName: "You",
      description: values.description,
      bookmarked: false,
    };
    if (values.type === "link") {
      base.linkUrl = values.linkUrl;
    } else if (values.type === "personal_note") {
      base.noteContent = values.noteContent;
    } else if (values.file) {
      base.fileName = values.file.name;
      base.fileSizeLabel = formatBytes(values.file.size);
      base.fileObjectUrl = URL.createObjectURL(values.file);
    } else {
      base.fileName = null;
    }
    setResources((prev) => [base, ...prev]);
    setModal(null);
    showToast("Resource uploaded.");
  };
  const handleNoteSubmit = (values) => {
    const lecture = values.lectureId ? lecturesDemoData.find((l) => l.id === values.lectureId) : null;
    const note = {
      id: `r-${Date.now()}`,
      name: values.title,
      subjectId: values.subjectId,
      lectureId: values.lectureId || null,
      classId: lecture?.classId ?? null,
      date: TODAY_ISO,
      type: "personal_note",
      uploadedBy: "student",
      uploaderName: "You",
      description: "",
      noteContent: values.content,
      bookmarked: false,
    };
    setResources((prev) => [note, ...prev]);
    setModal(null);
    showToast("Note saved.");
  };

  const selectedSubject = selectedSubjectId ? liveSubjects.find((s) => s.id === selectedSubjectId) : null;
  const subjectLectures = selectedSubjectId
    ? lecturesDemoData.filter((l) => l.subjectId === selectedSubjectId).sort((a, b) => (a.date < b.date ? 1 : -1))
    : [];

  return (
    <main className="flex-1 px-4 sm:px-8 py-6 max-w-6xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="cs-serif text-[26px] sm:text-[30px] font-semibold" style={{ color: "var(--ink)" }}>
            Notes & Resources
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--slate)" }}>
            All your lecture material, notes and resources in one place.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setModal("note")}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-sm font-medium"
            style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}
          >
            <Plus size={15} /> New Personal Note
          </button>
          <button onClick={() => setModal("upload")} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium" style={{ background: "var(--ink)", color: "#fff" }}>
            <Plus size={16} /> Upload Resource
          </button>
        </div>
      </div>

      <div
        className="mb-4 px-4 py-2.5 rounded-lg text-xs flex items-center gap-2"
        style={{ background: "var(--gold-tint)", border: "1px solid var(--gold-tint-line)", color: "var(--ink-soft)" }}
      >
        <Info size={13} /> Sample data — organized by subject and lecture, ready to be replaced with your real notes and resources.
      </div>

      <div className="mb-4">
        <NotesSearch value={query} onChange={setQuery} />
      </div>
      <div className="mb-5">
        <NotesFilters
          subjectId={filterSubjectId}
          onSubjectChange={setFilterSubjectId}
          type={filterType}
          onTypeChange={setFilterType}
          date={filterDate}
          onDateChange={setFilterDate}
          bookmarkedOnly={bookmarkedOnly}
          onBookmarkedToggle={() => setBookmarkedOnly((b) => !b)}
          isFiltering={isFiltering}
          onClear={clearFilters}
        />
      </div>

      {!isFiltering && !selectedSubjectId && <RecentlyAddedCard resources={resources} onOpenResource={openResource} />}

      {isFiltering ? (
        filteredResources.length === 0 ? (
          <NotesEmptyState onClear={clearFilters} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredResources.map((r) => (
              <ResourceCard key={r.id} resource={r} onClick={openResource} onToggleBookmark={handleToggleBookmark} showContext />
            ))}
          </div>
        )
      ) : selectedSubjectId ? (
        <div>
          <button onClick={() => setSelectedSubjectId(null)} className="text-xs font-medium mb-4" style={{ color: "var(--gold)" }}>
            ← Back to Subjects
          </button>
          <h2 className="cs-serif text-xl font-semibold mb-4" style={{ color: "var(--ink)" }}>
            {selectedSubject?.name}
          </h2>
          {subjectLectures.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--slate)" }}>No lectures recorded for this subject yet.</p>
          ) : (
            subjectLectures.map((lecture) => (
              <LectureSection
                key={lecture.id}
                lecture={lecture}
                resources={resources.filter((r) => r.lectureId === lecture.id)}
                onOpenResource={openResource}
                onToggleBookmark={handleToggleBookmark}
              />
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeSubjects().map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              stats={getSubjectStats(subject.id, resources)}
              onClick={() => setSelectedSubjectId(subject.id)}
            />
          ))}
        </div>
      )}

      {modal === "upload" && <UploadResourceModal onClose={closeModal} onSubmit={handleUploadSubmit} />}
      {modal === "note" && <PersonalNoteModal onClose={closeModal} onSubmit={handleNoteSubmit} />}
      {modal === "details" && selectedResource && (
        <ResourceDetailsModal
          resource={selectedResource}
          onClose={closeModal}
          onToggleBookmark={handleToggleBookmark}
          onDelete={handleDelete}
          onNotice={showToast}
        />
      )}

      <Toast message={toast} />
    </main>
  );
}

/* ================================================================
   ================  ASSIGNMENTS & DEADLINES  ======================
   ================================================================
   Step 6. Fully separate from Dashboard/Schedule/Notifications/Notes
   — this section adds a shared `assignments` list (owned by App,
   same pattern as `classes`/`notifications`/`resources`) plus the
   page that manages it. The Dashboard's existing "Upcoming
   Assignments" card is NOT modified — App() just feeds it a
   reshaped view of this same shared data via
   deriveDashboardAssignments(), the same approach used for the
   Schedule connection in Step 3.

   Assignment shape:
     { id, title, subjectId, type, facultyId, description,
       dateAssigned, deadlineDate, deadlineTime, priority, status,
       relatedClassId, relatedResourceIds, attachmentUrl, createdAt }

   type: "assignment" | "project" | "quiz" | "presentation" |
         "case_study" | "lab_report" | "other"
   priority: "low" | "medium" | "high" | "urgent"
   status (settable): "pending" | "in_progress" | "submitted" | "completed"
   ("overdue" is never stored — it's computed from the deadline, see
   getDisplayStatus below.)
   ================================================================ */

const ASSIGNMENT_TYPE_META = {
  assignment: "Assignment",
  project: "Project",
  quiz: "Quiz",
  presentation: "Presentation",
  case_study: "Case Study",
  lab_report: "Lab Report",
  other: "Other",
};

const PRIORITY_META = {
  low: { label: "Low", color: "var(--slate)" },
  medium: { label: "Medium", color: "var(--info)" },
  high: { label: "High", color: "var(--due-today)" },
  urgent: { label: "Urgent", color: "var(--warn)" },
};

const ASSIGNMENT_STATUS_META = {
  pending: { label: "Pending", color: "var(--ink-soft)", tint: "var(--paper)" },
  in_progress: { label: "In Progress", color: "var(--info)", tint: "var(--info-tint)" },
  submitted: { label: "Submitted", color: "#8A6A1F", tint: "var(--gold-tint)" },
  completed: { label: "Completed", color: "var(--good)", tint: "var(--good-tint)" },
  overdue: { label: "Overdue", color: "var(--warn)", tint: "var(--warn-tint)" },
};

// Urgency is never stored — always calculated from the deadline
// against the same demo "now" used elsewhere in the app.
const URGENCY_META = {
  overdue: { emoji: "🔴", label: "Overdue", color: "var(--warn)" },
  due_today: { emoji: "🟠", label: "Due Today", color: "var(--due-today)" },
  due_tomorrow: { emoji: "🟡", label: "Due Tomorrow", color: "var(--resched)" },
  due_week: { emoji: "🔵", label: "Due This Week", color: "var(--info)" },
  later: { emoji: "⚪", label: "Later", color: "var(--slate)" },
};

// SAMPLE assignments — a couple deliberately reference real
// Schedule classes (relatedClassId) and real Notes resources
// (relatedResourceIds) so those connections have something genuine
// to show, rather than duplicating either system's data.
const assignmentsDemoData = [
  { id: "a1", title: "ER Diagram Design — Assignment 3", subjectId: "sub-dbms", type: "assignment", facultyId: "fac-iyer", description: "Design an ER diagram and map it to a relational schema for the given case.", dateAssigned: "2026-09-03", deadlineDate: "2026-09-12", deadlineTime: "23:59", priority: "medium", status: "pending", relatedClassId: "s20", relatedResourceIds: ["r1", "r2"], attachmentUrl: "", createdAt: "2026-09-03" },
  { id: "a2", title: "Project Proposal Draft", subjectId: "sub-se", type: "project", facultyId: "fac-rao", description: "Submit a one-page proposal for the semester project.", dateAssigned: "2026-09-02", deadlineDate: "2026-09-11", deadlineTime: "23:59", priority: "high", status: "pending", relatedClassId: "s18", relatedResourceIds: [], attachmentUrl: "", createdAt: "2026-09-02" },
  { id: "a3", title: "Subnetting Lab Report", subjectId: "sub-cn", type: "lab_report", facultyId: "fac-menon", description: "Report covering subnetting exercises from the lab session.", dateAssigned: "2026-09-05", deadlineDate: "2026-09-15", deadlineTime: "23:59", priority: "low", status: "pending", relatedClassId: null, relatedResourceIds: [], attachmentUrl: "", createdAt: "2026-09-05" },
  { id: "a4", title: "BST Practice Set", subjectId: "sub-dsa", type: "assignment", facultyId: "fac-nair", description: "Insert/delete/traversal practice problems on binary search trees.", dateAssigned: "2026-09-08", deadlineDate: "2026-09-10", deadlineTime: "23:59", priority: "high", status: "in_progress", relatedClassId: "s14", relatedResourceIds: ["r9", "r10"], attachmentUrl: "", createdAt: "2026-09-08" },
  { id: "a5", title: "Process Scheduling Quiz", subjectId: "sub-os", type: "quiz", facultyId: "fac-kulkarni", description: "Short quiz on FCFS, SJF, Round Robin and Priority scheduling.", dateAssigned: "2026-09-05", deadlineDate: "2026-09-09", deadlineTime: "18:00", priority: "urgent", status: "pending", relatedClassId: null, relatedResourceIds: ["r11"], attachmentUrl: "", createdAt: "2026-09-05" },
  { id: "a6", title: "Database Design Presentation", subjectId: "sub-dbms", type: "presentation", facultyId: "fac-iyer", description: "Present the schema design for the course mini-project.", dateAssigned: "2026-09-04", deadlineDate: "2026-09-18", deadlineTime: "11:00", priority: "medium", status: "pending", relatedClassId: null, relatedResourceIds: [], attachmentUrl: "", createdAt: "2026-09-04" },
  { id: "a7", title: "Network Security Case Study", subjectId: "sub-cn", type: "case_study", facultyId: "fac-menon", description: "Analyze a real-world network security incident.", dateAssigned: "2026-09-06", deadlineDate: "2026-09-20", deadlineTime: "23:59", priority: "low", status: "pending", relatedClassId: null, relatedResourceIds: [], attachmentUrl: "", createdAt: "2026-09-06" },
  { id: "a8", title: "Normalization Worksheet", subjectId: "sub-dbms", type: "assignment", facultyId: "fac-iyer", description: "Worksheet on 1NF/2NF/3NF/BCNF.", dateAssigned: "2026-09-01", deadlineDate: "2026-09-08", deadlineTime: "23:59", priority: "medium", status: "completed", relatedClassId: null, relatedResourceIds: ["r5", "r6"], attachmentUrl: "", createdAt: "2026-09-01" },
  { id: "a9", title: "Array Rotation Problem Set", subjectId: "sub-dsa", type: "assignment", facultyId: "fac-nair", description: "Practice set on array rotation techniques.", dateAssigned: "2026-08-28", deadlineDate: "2026-09-05", deadlineTime: "23:59", priority: "low", status: "completed", relatedClassId: null, relatedResourceIds: [], attachmentUrl: "", createdAt: "2026-08-28" },
  { id: "a10", title: "SRS Document Submission", subjectId: "sub-se", type: "project", facultyId: "fac-rao", description: "Submit the completed Software Requirements Specification document.", dateAssigned: "2026-08-30", deadlineDate: "2026-09-09", deadlineTime: "23:59", priority: "high", status: "submitted", relatedClassId: "s18", relatedResourceIds: ["r12"], attachmentUrl: "", createdAt: "2026-08-30" },
  { id: "a11", title: "Routing Protocols Report", subjectId: "sub-cn", type: "lab_report", facultyId: "fac-menon", description: "Compare distance-vector and link-state routing protocols.", dateAssigned: "2026-09-07", deadlineDate: "2026-09-14", deadlineTime: "23:59", priority: "medium", status: "in_progress", relatedClassId: "s16", relatedResourceIds: ["r7", "r8"], attachmentUrl: "", createdAt: "2026-09-07" },
];

/* ------------------------------------------------------------
   Deadline / urgency / status logic — all computed, never
   stored, so editing the deadline or the clock (REFERENCE_*)
   automatically keeps everything consistent.
   ------------------------------------------------------------ */
function getNowMoment() {
  const d = new Date(REFERENCE_TODAY);
  d.setHours(Math.floor(REFERENCE_NOW_MINUTES / 60), REFERENCE_NOW_MINUTES % 60, 0, 0);
  return d;
}
function getDeadlineMoment(a) {
  const d = parseISODate(a.deadlineDate);
  const [h, m] = a.deadlineTime.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d;
}
// The real "is this late" check — status is not otherwise overridden.
function isPastDeadline(a) {
  return getDeadlineMoment(a) < getNowMoment();
}
// What the student actually sees as the status: their chosen
// status, unless the deadline has passed and it's still open.
function getDisplayStatus(a) {
  if (a.status === "completed" || a.status === "submitted") return a.status;
  return isPastDeadline(a) ? "overdue" : a.status;
}
// null once something is submitted/completed — no urgency badge
// needed for work that's already done.
function computeUrgency(a) {
  if (a.status === "completed" || a.status === "submitted") return null;
  if (isPastDeadline(a)) return "overdue";
  const dayDiff = Math.round((parseISODate(a.deadlineDate) - parseISODate(TODAY_ISO)) / 86400000);
  if (dayDiff <= 0) return "due_today";
  if (dayDiff === 1) return "due_tomorrow";
  if (dayDiff <= 6) return "due_week";
  return "later";
}
function formatRemaining(a) {
  if (isPastDeadline(a)) return "Overdue";
  const dayDiff = Math.round((parseISODate(a.deadlineDate) - parseISODate(TODAY_ISO)) / 86400000);
  if (dayDiff <= 0) return "Due today";
  if (dayDiff === 1) return "Due tomorrow";
  return `${dayDiff} days remaining`;
}
function formatDeadlineLabel(a) {
  return `${formatDayNum(parseISODate(a.deadlineDate))}, ${formatTime12(a.deadlineTime)}`;
}
function matchesAssignmentQuery(a, q) {
  if (!q || !q.trim()) return true;
  const haystack = [a.title, getSubjectName(a.subjectId), getFacultyName(a.facultyId), a.description].filter(Boolean).join(" ").toLowerCase();
  return haystack.includes(q.trim().toLowerCase());
}

// Reshapes the shared assignments state into exactly what the
// existing (unmodified) Dashboard UpcomingAssignmentsCard expects:
// { id, title, subject, due, urgency: "high"|"medium"|"low" }.
function deriveDashboardAssignments(list) {
  return list
    .filter((a) => getDisplayStatus(a) !== "completed")
    .sort((a, b) => (a.deadlineDate + a.deadlineTime < b.deadlineDate + b.deadlineTime ? -1 : 1))
    .slice(0, 5)
    .map((a) => {
      const urgency = computeUrgency(a);
      const mapped = urgency === "overdue" || urgency === "due_today" ? "high" : urgency === "due_tomorrow" || urgency === "due_week" ? "medium" : "low";
      return { id: a.id, title: a.title, subject: getSubjectName(a.subjectId), due: formatDeadlineLabel(a), urgency: mapped };
    });
}

/* ============================================================
   AssignmentStatus.jsx (component) — small reusable status pill
   ============================================================ */
function AssignmentStatus({ status }) {
  const meta = ASSIGNMENT_STATUS_META[status];
  return (
    <span className="text-[11px] font-semibold px-2 py-1 rounded-full flex-shrink-0" style={{ background: meta.tint, color: meta.color }}>
      {meta.label}
    </span>
  );
}

/* ============================================================
   AssignmentSummary.jsx (component)
   ============================================================ */
function AssignmentSummary({ assignments }) {
  const notCompleted = assignments.filter((a) => getDisplayStatus(a) !== "completed");
  const dueToday = notCompleted.filter((a) => computeUrgency(a) === "due_today").length;
  const dueThisWeek = notCompleted.filter((a) => ["due_today", "due_tomorrow", "due_week"].includes(computeUrgency(a))).length;
  const completed = assignments.filter((a) => getDisplayStatus(a) === "completed").length;
  const tiles = [
    { label: "Total Pending", value: notCompleted.length, color: "var(--ink)" },
    { label: "Due Today", value: dueToday, color: "var(--due-today)" },
    { label: "Due This Week", value: dueThisWeek, color: "var(--info)" },
    { label: "Completed", value: completed, color: "var(--good)" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {tiles.map((t) => (
        <div key={t.label} className="cs-card p-4 text-center">
          <p className="cs-serif text-2xl font-semibold" style={{ color: t.color }}>{t.value}</p>
          <p className="text-xs mt-1" style={{ color: "var(--slate)" }}>{t.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   AssignmentCard.jsx (component)
   ============================================================ */
function AssignmentCard({ assignment, onClick }) {
  const displayStatus = getDisplayStatus(assignment);
  const urgency = computeUrgency(assignment);
  const urgMeta = urgency ? URGENCY_META[urgency] : null;
  const priorityMeta = PRIORITY_META[assignment.priority];
  return (
    <button onClick={() => onClick(assignment)} className="cs-card w-full text-left p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{assignment.title}</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--slate)" }}>
            {getSubjectName(assignment.subjectId)} · {ASSIGNMENT_TYPE_META[assignment.type]}
          </p>
        </div>
        <AssignmentStatus status={displayStatus} />
      </div>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-xs" style={{ color: "var(--slate)" }}>Due: {formatDeadlineLabel(assignment)}</p>
        {urgMeta && (
          <p className="text-xs font-medium flex items-center gap-1" style={{ color: urgMeta.color }}>
            <span>{urgMeta.emoji}</span> {formatRemaining(assignment)}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 text-[11px] flex-wrap" style={{ color: "var(--slate)" }}>
        <span>Faculty: {getFacultyName(assignment.facultyId)}</span>
        <span style={{ color: priorityMeta.color }}>● {priorityMeta.label} priority</span>
      </div>
    </button>
  );
}

/* ============================================================
   AssignmentFilters.jsx (component)
   ============================================================ */
const ASSIGNMENT_STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In Progress" },
  { key: "submitted", label: "Submitted" },
  { key: "completed", label: "Completed" },
  { key: "overdue", label: "Overdue" },
];

function AssignmentFilters({ status, onStatusChange, subjectId, onSubjectChange, type, onTypeChange, priority, onPriorityChange, isFiltering, onClear }) {
  return (
    <div className="flex flex-col gap-2.5 mb-5">
      <div className="flex flex-wrap gap-2">
        {ASSIGNMENT_STATUS_FILTERS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onStatusChange(opt.key)}
            className="px-3 py-1.5 rounded-md text-xs font-medium"
            style={{
              background: status === opt.key ? "var(--ink)" : "var(--panel)",
              color: status === opt.key ? "#fff" : "var(--ink-soft)",
              border: "1px solid var(--line)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select value={subjectId} onChange={(e) => onSubjectChange(e.target.value)} className="cs-input" style={{ width: "auto" }}>
          <option value="all">All Subjects</option>
          {activeSubjects().map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select value={type} onChange={(e) => onTypeChange(e.target.value)} className="cs-input" style={{ width: "auto" }}>
          <option value="all">All Types</option>
          {Object.entries(ASSIGNMENT_TYPE_META).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select value={priority} onChange={(e) => onPriorityChange(e.target.value)} className="cs-input" style={{ width: "auto" }}>
          <option value="all">All Priorities</option>
          {Object.entries(PRIORITY_META).map(([key, meta]) => (
            <option key={key} value={key}>{meta.label}</option>
          ))}
        </select>
        {isFiltering && (
          <button onClick={onClear} className="text-xs font-medium" style={{ color: "var(--warn)" }}>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   AssignmentDetailsModal.jsx (component)
   ============================================================ */
function AssignmentDetailsModal({ assignment, onClose, onEdit, onChangeStatus, onDelete, onViewResources, resources }) {
  const displayStatus = getDisplayStatus(assignment);
  const priorityMeta = PRIORITY_META[assignment.priority];
  const relatedResources = (assignment.relatedResourceIds || [])
    .map((id) => resources.find((r) => r.id === id))
    .filter(Boolean);

  return (
    <ModalShell title="Assignment Details" onClose={onClose} wide>
      <div className="flex flex-col gap-3">
        <DetailRow label="Title" value={assignment.title} />
        <DetailRow label="Subject" value={getSubjectName(assignment.subjectId)} />
        <DetailRow label="Type" value={ASSIGNMENT_TYPE_META[assignment.type]} />
        <DetailRow label="Faculty" value={getFacultyName(assignment.facultyId)} />
        <DetailRow label="Description" value={assignment.description || "—"} />
        <DetailRow label="Date Assigned" value={formatLongDate(parseISODate(assignment.dateAssigned))} />
        <DetailRow label="Deadline" value={`${formatLongDate(parseISODate(assignment.deadlineDate))}, ${formatTime12(assignment.deadlineTime)}`} />
        <DetailRow label="Status" value={<span style={{ color: ASSIGNMENT_STATUS_META[displayStatus].color }}>{ASSIGNMENT_STATUS_META[displayStatus].label}</span>} />
        <DetailRow label="Priority" value={<span style={{ color: priorityMeta.color }}>{priorityMeta.label}</span>} />
        {assignment.attachmentUrl && (
          <DetailRow
            label="Attachment"
            value={
              <a href={assignment.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>
                {assignment.attachmentUrl}
              </a>
            }
          />
        )}
      </div>

      {relatedResources.length > 0 && (
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--line)" }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--slate)" }}>Related Resources</p>
          <div className="flex flex-col gap-1.5">
            {relatedResources.map((r) => (
              <button
                key={r.id}
                onClick={() => onViewResources(r.subjectId)}
                className="text-xs flex items-center gap-1.5 text-left"
                style={{ color: "var(--text)" }}
              >
                <span>{RESOURCE_TYPE_META[r.type].emoji}</span> {r.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--line)" }}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--slate)" }}>Change Status</p>
        <div className="flex flex-wrap gap-2">
          {["pending", "in_progress", "submitted", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => onChangeStatus(s)}
              className="px-3 py-1.5 rounded-md text-xs font-medium"
              style={{
                background: assignment.status === s ? "var(--ink)" : "var(--paper)",
                color: assignment.status === s ? "#fff" : "var(--ink-soft)",
                border: "1px solid var(--line)",
              }}
            >
              {ASSIGNMENT_STATUS_META[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: "1px solid var(--line)" }}>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium"
          style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}
        >
          <Pencil size={13} /> Edit
        </button>
        <button
          onClick={() => onDelete(assignment.id)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium"
          style={{ background: "var(--warn-tint)", color: "var(--warn)" }}
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   AssignmentFormModal.jsx (component) — shared by Add & Edit
   ============================================================ */
function AssignmentFormModal({ mode, initialValues, onClose, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const update = (field, val) => setValues((v) => ({ ...v, [field]: val }));

  const handleSubmit = () => {
    if (!values.title || !values.subjectId || !values.type || !values.deadlineDate || !values.deadlineTime || !values.priority) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    const subject = liveSubjects.find((s) => s.id === values.subjectId);
    onSubmit({ ...values, facultyId: subject?.facultyId ?? null });
  };

  return (
    <ModalShell title={mode === "add" ? "Add Assignment" : "Edit Assignment"} onClose={onClose} wide>
      <div className="flex flex-col gap-3">
        <FormField label="Assignment Title">
          <input type="text" value={values.title} onChange={(e) => update("title", e.target.value)} className="cs-input" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Subject">
            <select value={values.subjectId} onChange={(e) => update("subjectId", e.target.value)} className="cs-input">
              <option value="">Select a subject</option>
              {activeSubjects().map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Type">
            <select value={values.type} onChange={(e) => update("type", e.target.value)} className="cs-input">
              {Object.entries(ASSIGNMENT_TYPE_META).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField label="Faculty">
          <p className="text-sm py-2" style={{ color: values.subjectId ? "var(--text)" : "var(--slate)" }}>
            {values.subjectId
              ? getFacultyName(liveSubjects.find((s) => s.id === values.subjectId)?.facultyId) + " (from subject)"
              : "Select a subject to see the faculty"}
          </p>
        </FormField>
        <FormField label="Description (optional)">
          <textarea rows={2} value={values.description} onChange={(e) => update("description", e.target.value)} className="cs-input" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Date Assigned">
            <input type="date" value={values.dateAssigned} onChange={(e) => update("dateAssigned", e.target.value)} className="cs-input" />
          </FormField>
          <FormField label="Priority">
            <select value={values.priority} onChange={(e) => update("priority", e.target.value)} className="cs-input">
              {Object.entries(PRIORITY_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Deadline Date">
            <input type="date" value={values.deadlineDate} onChange={(e) => update("deadlineDate", e.target.value)} className="cs-input" />
          </FormField>
          <FormField label="Deadline Time">
            <input type="time" value={values.deadlineTime} onChange={(e) => update("deadlineTime", e.target.value)} className="cs-input" />
          </FormField>
        </div>
        {mode === "edit" && (
          <FormField label="Status">
            <select value={values.status} onChange={(e) => update("status", e.target.value)} className="cs-input">
              {["pending", "in_progress", "submitted", "completed"].map((s) => (
                <option key={s} value={s}>{ASSIGNMENT_STATUS_META[s].label}</option>
              ))}
            </select>
          </FormField>
        )}
        <FormField label="Attachment / Resource Link (optional)">
          <input type="text" placeholder="https://…" value={values.attachmentUrl} onChange={(e) => update("attachmentUrl", e.target.value)} className="cs-input" />
        </FormField>

        {error && <p className="text-xs" style={{ color: "var(--warn)" }}>{error}</p>}

        <div className="flex gap-2 mt-2">
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--ink)", color: "#fff" }}>
            {mode === "add" ? "Add Assignment" : "Save Changes"}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
            Cancel
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function AddAssignmentModal({ onClose, onSubmit }) {
  return (
    <AssignmentFormModal
      mode="add"
      initialValues={{ title: "", subjectId: "", type: "assignment", facultyId: "", description: "", dateAssigned: TODAY_ISO, deadlineDate: TODAY_ISO, deadlineTime: "23:59", priority: "medium", attachmentUrl: "" }}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}
function EditAssignmentModal({ assignment, onClose, onSubmit }) {
  return (
    <AssignmentFormModal
      mode="edit"
      initialValues={{
        title: assignment.title,
        subjectId: assignment.subjectId,
        type: assignment.type,
        facultyId: assignment.facultyId,
        description: assignment.description || "",
        dateAssigned: assignment.dateAssigned,
        deadlineDate: assignment.deadlineDate,
        deadlineTime: assignment.deadlineTime,
        priority: assignment.priority,
        status: assignment.status,
        attachmentUrl: assignment.attachmentUrl || "",
      }}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

/* ============================================================
   DeadlineCalendar.jsx (component) — simpler than the Schedule
   page's calendar: just deadline dots on a month grid.
   ============================================================ */
function DeadlineCalendar({ assignments, anchorDate, onAnchorChange, selectedDate, onSelectDate, onOpenAssignment }) {
  const weeks = getMonthMatrix(anchorDate);
  const month = anchorDate.getMonth();
  const countsByDate = {};
  assignments.forEach((a) => {
    countsByDate[a.deadlineDate] = (countsByDate[a.deadlineDate] || 0) + 1;
  });
  const selectedDayAssignments = assignments
    .filter((a) => a.deadlineDate === toISODate(selectedDate))
    .sort((a, b) => (a.deadlineTime < b.deadlineTime ? -1 : 1));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => onAnchorChange(new Date(anchorDate.getFullYear(), anchorDate.getMonth() - 1, 1))} className="cs-card p-2" style={{ color: "var(--ink-soft)" }}>
          <ChevronLeft size={16} />
        </button>
        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{formatMonthYear(anchorDate)}</p>
        <button onClick={() => onAnchorChange(new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 1))} className="cs-card p-2" style={{ color: "var(--ink-soft)" }}>
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="cs-card overflow-hidden">
        <div className="grid grid-cols-7" style={{ borderBottom: "1px solid var(--line)" }}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="text-center py-2 text-[11px] font-semibold" style={{ color: "var(--slate)" }}>{d}</div>
          ))}
        </div>
        {weeks.map((row, ri) => (
          <div key={ri} className="grid grid-cols-7">
            {row.map((date) => {
              const iso = toISODate(date);
              const inMonth = date.getMonth() === month;
              const count = countsByDate[iso] || 0;
              const isSelected = isSameDate(date, selectedDate);
              const isToday = isSameDate(date, REFERENCE_TODAY);
              return (
                <button
                  key={iso}
                  onClick={() => onSelectDate(date)}
                  className="flex flex-col items-center justify-center gap-1 p-2"
                  style={{
                    minHeight: "60px",
                    borderTop: "1px solid var(--line)",
                    borderLeft: "1px solid var(--line)",
                    background: isSelected ? "var(--gold-tint)" : "transparent",
                    opacity: inMonth ? 1 : 0.4,
                  }}
                >
                  <span className="text-xs font-medium" style={{ color: isToday ? "var(--gold)" : "var(--text)" }}>{date.getDate()}</span>
                  {count > 0 && <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--warn)" }} />}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="cs-card p-5 mt-4">
        <h3 className="cs-serif text-base font-semibold mb-3" style={{ color: "var(--ink)" }}>{formatLongDate(selectedDate)}</h3>
        {selectedDayAssignments.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--slate)" }}>No assignments due this day.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {selectedDayAssignments.map((a) => (
              <AssignmentCard key={a.id} assignment={a} onClick={onOpenAssignment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   AssignmentsPage.jsx (component) — owns filters/search/modal
   state. `assignments`/`setAssignments` are shared from App,
   same pattern as `classes`, `notifications`, `resources`.
   ============================================================ */
function AssignmentsPage({ assignments, setAssignments, onNotify, resources, onViewResources, autoOpenAdd, onAutoOpenHandled, pendingOpenAssignmentId, onPendingOpenHandled }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [view, setView] = useState("List");
  const [calendarAnchor, setCalendarAnchor] = useState(REFERENCE_TODAY);
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(REFERENCE_TODAY);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [modal, setModal] = useState(null); // "add" | "details" | "edit" | null
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const isFiltering = query.trim() !== "" || statusFilter !== "all" || subjectFilter !== "all" || typeFilter !== "all" || priorityFilter !== "all";
  // Quick action from the Control Center — opens this page's own
  // existing add modal rather than duplicating the form there.
  useEffect(() => {
    if (!autoOpenAdd) return;
    setModal("add");
    onAutoOpenHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenAdd]);


  const filtered = assignments.filter(
    (a) =>
      matchesAssignmentQuery(a, query) &&
      (statusFilter === "all" || getDisplayStatus(a) === statusFilter) &&
      (subjectFilter === "all" || a.subjectId === subjectFilter) &&
      (typeFilter === "all" || a.type === typeFilter) &&
      (priorityFilter === "all" || a.priority === priorityFilter)
  );
  const sorted = [...filtered].sort((a, b) => (a.deadlineDate + a.deadlineTime < b.deadlineDate + b.deadlineTime ? -1 : 1));

  const clearFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setSubjectFilter("all");
    setTypeFilter("all");
    setPriorityFilter("all");
  };

  const openAssignment = (a) => {
    setSelectedAssignmentId(a.id);
    setModal("details");
  };
  const closeModal = () => {
    setModal(null);
    setSelectedAssignmentId(null);
  };
  const selectedAssignment = selectedAssignmentId ? assignments.find((a) => a.id === selectedAssignmentId) : null;

  // Jumped here from another page (e.g. the Academic Calendar) to
  // view one specific assignment — opens the same details modal
  // this page already has, nothing duplicated.
  useEffect(() => {
    if (!pendingOpenAssignmentId) return;
    const a = assignments.find((x) => x.id === pendingOpenAssignmentId);
    if (a) openAssignment(a);
    onPendingOpenHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingOpenAssignmentId]);

  const handleAddSubmit = (values) => {
    const newAssignment = {
      id: `a-${Date.now()}`,
      title: values.title,
      subjectId: values.subjectId,
      type: values.type,
      facultyId: values.facultyId,
      description: values.description,
      dateAssigned: values.dateAssigned,
      deadlineDate: values.deadlineDate,
      deadlineTime: values.deadlineTime,
      priority: values.priority,
      status: "pending",
      relatedClassId: null,
      relatedResourceIds: [],
      attachmentUrl: values.attachmentUrl || null,
      createdAt: TODAY_ISO,
    };
    setAssignments((prev) => [newAssignment, ...prev]);
    setModal(null);
    showToast("Assignment added.");
    onNotify({
      type: "assignment",
      title: "New Assignment",
      message: `${values.title} has been added for ${getSubjectName(values.subjectId)}.`,
      relatedClassId: null,
    });
  };

  const handleEditSubmit = (values) => {
    setAssignments((prev) => prev.map((a) => (a.id === selectedAssignmentId ? { ...a, ...values } : a)));
    setModal(null);
    setSelectedAssignmentId(null);
    showToast("Assignment updated.");
  };

  const handleChangeStatus = (status) => {
    setAssignments((prev) => prev.map((a) => (a.id === selectedAssignmentId ? { ...a, status } : a)));
    showToast(`Marked as ${ASSIGNMENT_STATUS_META[status].label}.`);
  };

  const handleDelete = (id) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    closeModal();
    showToast("Assignment deleted.");
  };

  return (
    <main className="flex-1 px-4 sm:px-8 py-6 max-w-6xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="cs-serif text-[26px] sm:text-[30px] font-semibold" style={{ color: "var(--ink)" }}>Assignments</h1>
          <p className="text-sm mt-1" style={{ color: "var(--slate)" }}>Keep track of what needs to be submitted and when.</p>
        </div>
        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium self-start sm:self-auto"
          style={{ background: "var(--ink)", color: "#fff" }}
        >
          <Plus size={16} /> Add Assignment
        </button>
      </div>

      <div
        className="mb-4 px-4 py-2.5 rounded-lg text-xs flex items-center gap-2"
        style={{ background: "var(--gold-tint)", border: "1px solid var(--gold-tint-line)", color: "var(--ink-soft)" }}
      >
        <Info size={13} /> Sample data — will be replaced with your real assignments and deadlines.
      </div>

      <AssignmentSummary assignments={assignments} />

      <div className="mb-4">
        <NotesSearch value={query} onChange={setQuery} placeholder="Search assignments…" />
      </div>

      <AssignmentFilters
        status={statusFilter}
        onStatusChange={setStatusFilter}
        subjectId={subjectFilter}
        onSubjectChange={setSubjectFilter}
        type={typeFilter}
        onTypeChange={setTypeFilter}
        priority={priorityFilter}
        onPriorityChange={setPriorityFilter}
        isFiltering={isFiltering}
        onClear={clearFilters}
      />

      <div className="cs-card p-1 flex items-center gap-1 mb-5" style={{ width: "fit-content" }}>
        {["List", "Calendar"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="px-3 py-1.5 rounded-md text-xs font-medium"
            style={{ background: view === v ? "var(--ink)" : "transparent", color: view === v ? "#fff" : "var(--slate)" }}
          >
            {v}
          </button>
        ))}
      </div>

      {view === "List" ? (
        <>
          <h2 className="cs-serif text-lg font-semibold mb-3" style={{ color: "var(--ink)" }}>
            {isFiltering ? "Results" : "Upcoming"}
          </h2>
          {sorted.length === 0 ? (
            <NotesEmptyState onClear={clearFilters} message="No assignments found" />
          ) : (
            <div className="flex flex-col gap-3">
              {sorted.map((a) => (
                <AssignmentCard key={a.id} assignment={a} onClick={openAssignment} />
              ))}
            </div>
          )}
        </>
      ) : (
        <DeadlineCalendar
          assignments={filtered}
          anchorDate={calendarAnchor}
          onAnchorChange={setCalendarAnchor}
          selectedDate={calendarSelectedDate}
          onSelectDate={setCalendarSelectedDate}
          onOpenAssignment={openAssignment}
        />
      )}

      {modal === "add" && <AddAssignmentModal onClose={closeModal} onSubmit={handleAddSubmit} />}
      {modal === "edit" && selectedAssignment && <EditAssignmentModal assignment={selectedAssignment} onClose={closeModal} onSubmit={handleEditSubmit} />}
      {modal === "details" && selectedAssignment && (
        <AssignmentDetailsModal
          assignment={selectedAssignment}
          onClose={closeModal}
          onEdit={() => setModal("edit")}
          onChangeStatus={handleChangeStatus}
          onDelete={handleDelete}
          onViewResources={onViewResources}
          resources={resources}
        />
      )}

      <Toast message={toast} />
    </main>
  );
}

/* ================================================================
   ======================  ATTENDANCE  =============================
   ================================================================
   Step 7. Fully separate from Dashboard/Schedule/Notifications/
   Notes/Assignments — adds a shared `attendanceRecords` list (same
   pattern as `classes`/`notifications`/`resources`/`assignments`)
   plus the page that manages it. The Dashboard's existing
   AttendanceOverviewCard is NOT modified — App() just feeds it a
   reshaped view of this same data via deriveDashboardAttendance(),
   the same approach used for Schedule/Assignments.

   Record shape:
     { id, classId, subjectId, date, time, status }

   status: "present" | "absent" | "excused"

   classId links to a real class in `scheduleDemoData` when one
   exists for that date/subject; faculty is always derived (never
   duplicated) — either from the linked class, or, when there's no
   class that far back in the Schedule's sample data, from the one
   faculty member who normally teaches that subject.
   ================================================================ */

// The single configurable attendance requirement — every
// calculation and status check below reads this constant instead
// of a scattered "75".
// The attendance requirement is a PREFERENCE, not a constant — the
// student sets it in the Control Center and every calculation and
// label below reads it through this one accessor. "Safe" sits 5
// points above whatever the requirement is, so the three status
// tiers keep their relative meaning at any threshold.
const requiredAttendance = () => livePreferences.requiredAttendance ?? 75;
const safeAttendance = () => requiredAttendance() + 5;

/* ------------------------------------------------------------
   SAMPLE attendance history generator.
   Each subject has a fixed weekly meeting pattern (days of the
   week + a typical time/room/faculty) and a simple, deterministic
   rule for which sessions were missed — this is demo data, but
   generated rather than hand-typed so the totals are internally
   consistent, and it's tuned so the five subjects land across all
   three status tiers (Safe / At Risk / Below Required).
   ------------------------------------------------------------ */
const ATTENDANCE_SUBJECT_PATTERNS = {
  "sub-dsa": { days: [1, 2, 4, 6], time: "09:00", absentEvery: 7, excusedEvery: 0 },
  "sub-dbms": { days: [1, 2, 3, 4], time: "10:15", absentEvery: 4, excusedEvery: 0 },
  "sub-cn": { days: [1, 3, 5], time: "10:15", absentEvery: 6, excusedEvery: 0 },
  "sub-os": { days: [2, 3], time: "09:00", absentEvery: 3, excusedEvery: 0 },
  "sub-se": { days: [2, 5, 6], time: "14:00", absentEvery: 8, excusedEvery: 0 },
};
const ATTENDANCE_HISTORY_START = addDays(REFERENCE_TODAY, -21); // 3 weeks of sample history

function getSubjectFaculty(subjectId) {
  const anyClass = scheduleDemoData.find((c) => c.subjectId === subjectId);
  return anyClass ? anyClass.facultyId : null;
}
function getRecordTime(record) {
  if (record.classId) {
    const cls = scheduleDemoData.find((c) => c.id === record.classId);
    if (cls) return cls.startTime;
  }
  return record.time;
}
function getRecordFacultyId(record) {
  if (record.classId) {
    const cls = scheduleDemoData.find((c) => c.id === record.classId);
    if (cls) return cls.facultyId;
  }
  return getSubjectFaculty(record.subjectId);
}

function generateAttendanceRecords() {
  const records = [];
  let idCounter = 1;
  const counters = {};
  Object.keys(ATTENDANCE_SUBJECT_PATTERNS).forEach((k) => (counters[k] = 0));

  for (let d = ATTENDANCE_HISTORY_START; d <= REFERENCE_TODAY; d = addDays(d, 1)) {
    const dow = d.getDay();
    Object.entries(ATTENDANCE_SUBJECT_PATTERNS).forEach(([subjectId, pattern]) => {
      if (!pattern.days.includes(dow)) return;
      counters[subjectId] += 1;
      const n = counters[subjectId];
      let status = "present";
      if (pattern.excusedEvery && n % pattern.excusedEvery === 0) status = "excused";
      else if (n % pattern.absentEvery === 0) status = "absent";
      const iso = toISODate(d);
      const matchingClass = scheduleDemoData.find((c) => c.subjectId === subjectId && c.date === iso && c.status !== "cancelled");
      records.push({
        id: `att-${idCounter++}`,
        classId: matchingClass ? matchingClass.id : null,
        subjectId,
        date: iso,
        time: matchingClass ? matchingClass.startTime : pattern.time,
        status,
      });
    });
  }
  // A couple of the generated absences double as "excused" examples
  // (doesn't change any percentage — present/absent vs present/excused
  // are both "not present" for the calculation) so the history and
  // filters have a realistic mix of all three statuses to show.
  const firstAbsent = (subjectId) => records.find((r) => r.subjectId === subjectId && r.status === "absent");
  const cnAbsence = firstAbsent("sub-cn");
  if (cnAbsence) cnAbsence.status = "excused";
  const osAbsences = records.filter((r) => r.subjectId === "sub-os" && r.status === "absent");
  if (osAbsences[1]) osAbsences[1].status = "excused";

  return records;
}
const attendanceRecordsDemoData = generateAttendanceRecords();

/* ------------------------------------------------------------
   Attendance math — all derived from records, nothing stored.
   ------------------------------------------------------------ */
function computeAttendanceStats(records) {
  const attended = records.filter((r) => r.status === "present").length;
  const missed = records.filter((r) => r.status === "absent").length;
  const excused = records.filter((r) => r.status === "excused").length;
  const total = records.length;
  const percentage = total > 0 ? (attended / total) * 100 : 0;
  return { attended, missed, excused, total, percentage };
}
function getAttendanceStatus(percentage) {
  if (percentage >= safeAttendance()) return "safe";
  if (percentage >= requiredAttendance()) return "at_risk";
  return "below";
}
const ATTENDANCE_STATUS_META = {
  safe: { emoji: "🟢", label: "Safe", color: "var(--good)" },
  at_risk: { emoji: "🟡", label: "At Risk", color: "var(--resched)" },
  below: { emoji: "🔴", label: "Below Required", color: "var(--warn)" },
};
// Minimum consecutive future classes to attend to reach the
// required percentage: solve (A + x) / (T + x) >= target for x.
function classesNeededToReachTarget(attended, total) {
  const target = requiredAttendance() / 100;
  if (total > 0 && attended / total >= target) return 0;
  const x = (target * total - attended) / (1 - target);
  return Math.max(0, Math.ceil(x));
}
// Maximum future classes that can be missed while staying at or
// above the required percentage: solve A / (T + x) >= target for x.
function classesCanMissSafely(attended, total) {
  const target = requiredAttendance() / 100;
  if (total === 0) return 0;
  const x = attended / target - total;
  return Math.max(0, Math.floor(x));
}
// Groups records into the 3-week sample history window for the
// trend chart — kept intentionally simple (weekly average only).
function computeWeeklyTrend(records) {
  const weeks = [];
  for (let w = 0; w < 3; w++) {
    const weekStart = addDays(ATTENDANCE_HISTORY_START, w * 7);
    const weekEnd = addDays(weekStart, 6);
    const inWeek = records.filter((r) => r.date >= toISODate(weekStart) && r.date <= toISODate(weekEnd));
    const stats = computeAttendanceStats(inWeek);
    weeks.push({ label: `Week ${w + 1}`, percentage: stats.total > 0 ? Math.round(stats.percentage) : null });
  }
  return weeks.filter((w) => w.percentage !== null);
}

// Reshapes the shared records into exactly what the existing
// (unmodified) Dashboard AttendanceOverviewCard expects:
// { overall, minimumRequired, subjects: [{subjectId, pct, name}] }.
function deriveDashboardAttendance(records) {
  const overallStats = computeAttendanceStats(records);
  const subjects = activeSubjects()
    .map((s) => {
      const stats = computeAttendanceStats(records.filter((r) => r.subjectId === s.id));
      return stats.total > 0 ? { subjectId: s.id, pct: Math.round(stats.percentage), name: s.name } : null;
    })
    .filter(Boolean);
  return { overall: Math.round(overallStats.percentage), minimumRequired: requiredAttendance(), subjects };
}

/* ============================================================
   OverallAttendanceCard.jsx (component)
   ============================================================ */
function OverallAttendanceCard({ records }) {
  const stats = computeAttendanceStats(records);
  const pct = Math.round(stats.percentage);
  const statusMeta = ATTENDANCE_STATUS_META[getAttendanceStatus(pct)];
  return (
    <div className="cs-card p-6 flex flex-col sm:flex-row items-center gap-6 mb-5">
      <AttendanceRing pct={pct} />
      <div className="flex-1">
        <p className="cs-serif text-lg font-semibold" style={{ color: "var(--ink)" }}>Overall Attendance</p>
        <p className="text-xs mt-1 font-medium" style={{ color: statusMeta.color }}>{statusMeta.emoji} {statusMeta.label}</p>
        <div className="flex items-center gap-5 mt-3 text-sm" style={{ color: "var(--text)" }}>
          <span>{stats.attended} Attended</span>
          <span>{stats.missed} Missed</span>
          {stats.excused > 0 && <span>{stats.excused} Excused</span>}
          <span>{stats.total} Total Classes</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SubjectAttendanceCard.jsx (component)
   ============================================================ */
function SubjectAttendanceCard({ subjectId, records }) {
  const stats = computeAttendanceStats(records.filter((r) => r.subjectId === subjectId));
  if (stats.total === 0) return null;
  const pct = Math.round(stats.percentage);
  const status = getAttendanceStatus(pct);
  const statusMeta = ATTENDANCE_STATUS_META[status];
  const needed = status === "below" ? classesNeededToReachTarget(stats.attended, stats.total) : null;
  const canMiss = status !== "below" ? classesCanMissSafely(stats.attended, stats.total) : null;

  return (
    <div className="cs-card p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{getSubjectName(subjectId)}</p>
        <span className="text-[11px] font-medium flex-shrink-0" style={{ color: statusMeta.color }}>{statusMeta.emoji} {statusMeta.label}</span>
      </div>
      <p className="text-xs mb-1.5" style={{ color: "var(--slate)" }}>{stats.attended} / {stats.total}</p>
      <div className="h-1.5 rounded-full mb-2" style={{ background: "var(--line)" }}>
        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: statusMeta.color }} />
      </div>
      <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>{pct}%</p>
      {needed !== null && needed > 0 && (
        <p className="text-[11px]" style={{ color: "var(--warn)" }}>Attend the next {needed} class{needed !== 1 ? "es" : ""} to reach {requiredAttendance()}%.</p>
      )}
      {canMiss !== null && canMiss > 0 && (
        <p className="text-[11px]" style={{ color: "var(--slate)" }}>Can miss {canMiss} more class{canMiss !== 1 ? "es" : ""} and stay above {requiredAttendance()}%.</p>
      )}
      {canMiss === 0 && status !== "below" && (
        <p className="text-[11px]" style={{ color: "var(--slate)" }}>Right at the edge — missing another class would drop below {requiredAttendance()}%.</p>
      )}
    </div>
  );
}

/* ============================================================
   AttendanceWarning.jsx (component)
   ============================================================ */
function AttendanceWarning({ records }) {
  const belowSubjects = activeSubjects()
    .map((s) => {
      const stats = computeAttendanceStats(records.filter((r) => r.subjectId === s.id));
      return stats.total > 0 ? { subject: s, stats, pct: Math.round(stats.percentage) } : null;
    })
    .filter((s) => s && getAttendanceStatus(s.pct) === "below");

  if (belowSubjects.length === 0) return null;

  return (
    <div className="cs-card p-5 mb-5" style={{ background: "var(--warn-tint)", borderColor: "#E9C6BA" }}>
      <p className="text-sm font-semibold flex items-center gap-2 mb-3" style={{ color: "var(--warn)" }}>
        <AlertTriangle size={15} /> Attendance Warning
      </p>
      <div className="flex flex-col gap-3">
        {belowSubjects.map(({ subject, stats, pct }) => {
          const needed = classesNeededToReachTarget(stats.attended, stats.total);
          return (
            <div key={subject.id}>
              <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>{subject.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>Current attendance: {pct}%</p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: "var(--warn)" }}>
                You need to attend the next {needed} class{needed !== 1 ? "es" : ""} to reach {requiredAttendance()}%.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   AttendanceTrend.jsx (component)
   ============================================================ */
function AttendanceTrend({ records }) {
  const weeks = computeWeeklyTrend(records);
  if (weeks.length === 0) return null;
  return (
    <div className="cs-card p-5 mb-5">
      <h2 className="cs-serif text-base font-semibold mb-3" style={{ color: "var(--ink)" }}>Attendance Trend</h2>
      <div className="flex flex-col gap-2.5">
        {weeks.map((w) => (
          <div key={w.label} className="flex items-center gap-3">
            <span className="text-xs w-16 flex-shrink-0" style={{ color: "var(--slate)" }}>{w.label}</span>
            <div className="flex-1 h-2 rounded-full" style={{ background: "var(--line)" }}>
              <div
                className="h-2 rounded-full"
                style={{ width: `${w.percentage}%`, background: w.percentage >= requiredAttendance() ? "var(--good)" : "var(--warn)" }}
              />
            </div>
            <span className="text-xs w-10 text-right flex-shrink-0" style={{ color: "var(--text)" }}>{w.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   AttendanceFilters.jsx (component)
   ============================================================ */
function AttendanceFilters({ subjectId, onSubjectChange, status, onStatusChange, fromDate, onFromDateChange, toDate, onToDateChange, isFiltering, onClear }) {
  return (
    <div className="flex flex-col gap-2.5 mb-4">
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "All" },
          { key: "present", label: "Present" },
          { key: "absent", label: "Absent" },
          { key: "excused", label: "Excused" },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => onStatusChange(opt.key)}
            className="px-3 py-1.5 rounded-md text-xs font-medium"
            style={{
              background: status === opt.key ? "var(--ink)" : "var(--panel)",
              color: status === opt.key ? "#fff" : "var(--ink-soft)",
              border: "1px solid var(--line)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select value={subjectId} onChange={(e) => onSubjectChange(e.target.value)} className="cs-input" style={{ width: "auto" }}>
          <option value="all">All Subjects</option>
          {activeSubjects().map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <span className="text-xs" style={{ color: "var(--slate)" }}>From</span>
        <input type="date" value={fromDate} onChange={(e) => onFromDateChange(e.target.value)} className="cs-input" style={{ width: "auto" }} />
        <span className="text-xs" style={{ color: "var(--slate)" }}>To</span>
        <input type="date" value={toDate} onChange={(e) => onToDateChange(e.target.value)} className="cs-input" style={{ width: "auto" }} />
        {isFiltering && (
          <button onClick={onClear} className="text-xs font-medium" style={{ color: "var(--warn)" }}>Clear Filters</button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   AttendanceHistory.jsx (component)
   ============================================================ */
const ATTENDANCE_RECORD_STATUS_META = {
  present: { label: "Present", color: "var(--good)", tint: "var(--good-tint)" },
  absent: { label: "Absent", color: "var(--warn)", tint: "var(--warn-tint)" },
  excused: { label: "Excused", color: "var(--info)", tint: "var(--info-tint)" },
};

function AttendanceHistory({ records, onEdit, onClearFilters }) {
  const sorted = [...records].sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1));
  return (
    <div className="cs-card p-5 sm:p-6">
      <h2 className="cs-serif text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>Attendance History</h2>
      {sorted.length === 0 ? (
        <NotesEmptyState onClear={onClearFilters} message="No attendance records found." />
      ) : (
        <div className="flex flex-col cs-scroll max-h-96 overflow-y-auto pr-1">
          {sorted.map((r, idx) => {
            const meta = ATTENDANCE_RECORD_STATUS_META[r.status];
            return (
              <button
                key={r.id}
                onClick={() => onEdit(r)}
                className="flex items-center gap-3 py-3 text-left w-full"
                style={{ borderTop: idx === 0 ? "none" : "1px solid var(--line)" }}
              >
                <div className="w-[76px] flex-shrink-0 text-xs font-medium" style={{ color: "var(--slate)" }}>
                  {formatDayNum(parseISODate(r.date))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{getSubjectName(r.subjectId)}</p>
                  <p className="text-xs truncate" style={{ color: "var(--slate)" }}>
                    {getFacultyName(getRecordFacultyId(r))} · {formatTime12(getRecordTime(r))}
                  </p>
                </div>
                <span className="text-[11px] font-semibold px-2 py-1 rounded-full flex-shrink-0" style={{ background: meta.tint, color: meta.color }}>
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MarkAttendanceModal.jsx (component) — shared by Add & Edit
   ============================================================ */
function MarkAttendanceModal({ mode, initialValues, onClose, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const update = (field, val) => setValues((v) => ({ ...v, [field]: val }));

  // Offer any real class on the chosen date/subject, so the record
  // can link to it instead of duplicating its details.
  const classOptions = values.subjectId
    ? scheduleDemoData.filter((c) => c.subjectId === values.subjectId && c.date === values.date)
    : [];

  const handleSubmit = () => {
    if (!values.date || !values.subjectId || !values.status) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    onSubmit(values);
  };

  return (
    <ModalShell title={mode === "add" ? "Mark Attendance" : "Edit Attendance Record"} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <FormField label="Date">
          <input type="date" value={values.date} onChange={(e) => update("date", e.target.value)} className="cs-input" />
        </FormField>
        <FormField label="Subject">
          <select
            value={values.subjectId}
            onChange={(e) => {
              update("subjectId", e.target.value);
              update("classId", null);
            }}
            className="cs-input"
          >
            <option value="">Select a subject</option>
            {activeSubjects().map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Class (optional)">
          <select value={values.classId || ""} onChange={(e) => update("classId", e.target.value || null)} className="cs-input" disabled={classOptions.length === 0}>
            <option value="">{classOptions.length === 0 ? "No matching class on this date" : "Select a class"}</option>
            {classOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.startTime} – {c.endTime} · {c.room}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Status">
          <select value={values.status} onChange={(e) => update("status", e.target.value)} className="cs-input">
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="excused">Excused</option>
          </select>
        </FormField>

        {error && <p className="text-xs" style={{ color: "var(--warn)" }}>{error}</p>}

        <div className="flex gap-2 mt-2">
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--ink)", color: "#fff" }}>
            {mode === "add" ? "Save Record" : "Save Changes"}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
            Cancel
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   AttendancePage.jsx (component) — owns filters/modal state.
   `records`/`setRecords` are shared from App, same pattern as
   `classes`, `notifications`, `resources`, `assignments`.
   ============================================================ */
function AttendancePage({ records, setRecords, autoOpenAdd, onAutoOpenHandled }) {
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [modal, setModal] = useState(null); // "add" | "edit" | null
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const isFiltering = subjectFilter !== "all" || statusFilter !== "all" || fromDate !== "" || toDate !== "";
  // Quick action from the Control Center — opens this page's own
  // existing add modal rather than duplicating the form there.
  useEffect(() => {
    if (!autoOpenAdd) return;
    setModal("add");
    onAutoOpenHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenAdd]);


  const filteredRecords = records.filter(
    (r) =>
      (subjectFilter === "all" || r.subjectId === subjectFilter) &&
      (statusFilter === "all" || r.status === statusFilter) &&
      (!fromDate || r.date >= fromDate) &&
      (!toDate || r.date <= toDate)
  );

  const clearFilters = () => {
    setSubjectFilter("all");
    setStatusFilter("all");
    setFromDate("");
    setToDate("");
  };

  const editingRecord = editingRecordId ? records.find((r) => r.id === editingRecordId) : null;

  const handleAddSubmit = (values) => {
    const matchingClass = values.classId ? scheduleDemoData.find((c) => c.id === values.classId) : null;
    const time = matchingClass ? matchingClass.startTime : ATTENDANCE_SUBJECT_PATTERNS[values.subjectId]?.time || "09:00";
    const newRecord = { id: `att-${Date.now()}`, classId: values.classId || null, subjectId: values.subjectId, date: values.date, time, status: values.status };
    setRecords((prev) => [newRecord, ...prev]);
    setModal(null);
    showToast("Attendance recorded.");
  };
  const handleEditSubmit = (values) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === editingRecordId
          ? { ...r, classId: values.classId || null, subjectId: values.subjectId, date: values.date, status: values.status }
          : r
      )
    );
    setModal(null);
    setEditingRecordId(null);
    showToast("Attendance updated.");
  };

  return (
    <main className="flex-1 px-4 sm:px-8 py-6 max-w-6xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="cs-serif text-[26px] sm:text-[30px] font-semibold" style={{ color: "var(--ink)" }}>Attendance</h1>
          <p className="text-sm mt-1" style={{ color: "var(--slate)" }}>Track your attendance and stay above the required percentage.</p>
        </div>
        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium self-start sm:self-auto"
          style={{ background: "var(--ink)", color: "#fff" }}
        >
          <Plus size={16} /> Mark Attendance
        </button>
      </div>

      <div
        className="mb-4 px-4 py-2.5 rounded-lg text-xs flex items-center gap-2"
        style={{ background: "var(--gold-tint)", border: "1px solid var(--gold-tint-line)", color: "var(--ink-soft)" }}
      >
        <Info size={13} /> Sample data — calculated live from demo attendance records, ready to be replaced with your real history.
      </div>

      <OverallAttendanceCard records={records} />
      <AttendanceWarning records={records} />

      <h2 className="cs-serif text-lg font-semibold mb-3" style={{ color: "var(--ink)" }}>By Subject</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        {activeSubjects().map((s) => (
          <SubjectAttendanceCard key={s.id} subjectId={s.id} records={records} />
        ))}
      </div>

      <AttendanceTrend records={records} />

      <AttendanceFilters
        subjectId={subjectFilter}
        onSubjectChange={setSubjectFilter}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        fromDate={fromDate}
        onFromDateChange={setFromDate}
        toDate={toDate}
        onToDateChange={setToDate}
        isFiltering={isFiltering}
        onClear={clearFilters}
      />

      <AttendanceHistory
        records={filteredRecords}
        onClearFilters={clearFilters}
        onEdit={(r) => {
          setEditingRecordId(r.id);
          setModal("edit");
        }}
      />

      {modal === "add" && (
        <MarkAttendanceModal
          mode="add"
          initialValues={{ date: TODAY_ISO, subjectId: "", classId: null, status: "present" }}
          onClose={() => setModal(null)}
          onSubmit={handleAddSubmit}
        />
      )}
      {modal === "edit" && editingRecord && (
        <MarkAttendanceModal
          mode="edit"
          initialValues={{ date: editingRecord.date, subjectId: editingRecord.subjectId, classId: editingRecord.classId, status: editingRecord.status }}
          onClose={() => {
            setModal(null);
            setEditingRecordId(null);
          }}
          onSubmit={handleEditSubmit}
        />
      )}

      <Toast message={toast} />
    </main>
  );
}

/* ================================================================
   ============  PERSONAL & ACADEMIC SETUP  ========================
   ================================================================
   Step 8. This is the architectural change: personal info,
   academic info, and subjects (with their faculty) stop being
   frozen constants and become centralized, user-editable state —
   owned by App, same shared-state pattern as classes/notifications/
   resources/assignments/attendanceRecords.

   Subjects now embed their faculty directly (name + email), since
   there's no separate faculty management yet (per the brief, that
   comes later) — each subject is:
     { id, name, code, facultyId, facultyName, facultyEmail, room, credits }

   `facultyId` is kept as an internal join key purely so every
   existing class/assignment/attendance record — which already
   stores a `facultyId` — keeps resolving correctly through
   getFacultyName() without migrating any of that historical data.

   `liveSubjects` / `livePreferences` below are module-level mirrors
   of the `subjects` / `preferences` React state in App, kept in
   sync by small wrapper setters. This is what lets every existing
   page (Schedule, Notes, Assignments, Attendance) — none of which
   receive `subjects` as an explicit prop — automatically reflect a
   subject added, renamed, or removed in Subject Management, without
   threading a new prop through the entire component tree.
   ================================================================ */


function getInitials(name) {
  if (!name || !name.trim()) return "?";
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

/* ============================================================
   Avatar.jsx (component) — real photo if one was uploaded,
   otherwise initials generated from the name. No external
   image service involved either way.
   ============================================================ */
function Avatar({ profile, size = 32 }) {
  if (profile.photoUrl) {
    return (
      <img
        src={profile.photoUrl}
        alt={profile.name || "Profile"}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.4, background: "var(--gold-tint)", color: "var(--ink)" }}
    >
      {getInitials(profile.name)}
    </div>
  );
}

/* ============================================================
   ProfileForm.jsx (component) — Personal Information fields
   ============================================================ */
function ProfileForm({ values, onChange }) {
  const update = (field, val) => onChange({ ...values, [field]: val });
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <Avatar profile={values} size={56} />
        <FormField label="Profile Picture">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) update("photoUrl", URL.createObjectURL(file));
            }}
            className="cs-input"
          />
        </FormField>
      </div>
      <p className="text-[11px]" style={{ color: "var(--slate)" }}>
        <Camera size={11} className="inline mr-1" />
        Stored only in this browser tab for this session — not uploaded anywhere.
      </p>
      <FormField label="Full Name">
        <input type="text" placeholder="Enter your full name" value={values.name} onChange={(e) => update("name", e.target.value)} className="cs-input" />
      </FormField>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Email">
          <input type="email" placeholder="Enter your email" value={values.email} onChange={(e) => update("email", e.target.value)} className="cs-input" />
        </FormField>
        <FormField label="Phone Number (optional)">
          <input type="tel" placeholder="Enter your phone number" value={values.phone} onChange={(e) => update("phone", e.target.value)} className="cs-input" />
        </FormField>
      </div>
    </div>
  );
}

/* ============================================================
   AcademicInfoForm.jsx (component) — Academic Information fields
   ============================================================ */
function AcademicInfoForm({ values, onChange }) {
  const update = (field, val) => onChange({ ...values, [field]: val });
  return (
    <div className="flex flex-col gap-3">
      <FormField label="College / University">
        <input type="text" placeholder="Enter your college/university" value={values.college} onChange={(e) => update("college", e.target.value)} className="cs-input" />
      </FormField>
      <FormField label="Program / Course">
        <input type="text" placeholder="e.g. B.Tech · Computer Science" value={values.program} onChange={(e) => update("program", e.target.value)} className="cs-input" />
      </FormField>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Department">
          <input type="text" placeholder="e.g. Computer Science & Engineering" value={values.department || ""} onChange={(e) => update("department", e.target.value)} className="cs-input" />
        </FormField>
        <FormField label="Academic Session">
          <input type="text" placeholder="e.g. 2026–27" value={values.academicSession || ""} onChange={(e) => update("academicSession", e.target.value)} className="cs-input" />
        </FormField>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FormField label="Year">
          <input type="text" placeholder="e.g. 3rd Year" value={values.year} onChange={(e) => update("year", e.target.value)} className="cs-input" />
        </FormField>
        <FormField label="Semester">
          <input type="text" placeholder="e.g. Semester 5" value={values.semester} onChange={(e) => update("semester", e.target.value)} className="cs-input" />
        </FormField>
        <FormField label="Section">
          <input type="text" placeholder="e.g. CSE-B" value={values.section} onChange={(e) => update("section", e.target.value)} className="cs-input" />
        </FormField>
      </div>
      <FormField label="Roll Number (optional)">
        <input type="text" placeholder="Enter your roll number" value={values.roll} onChange={(e) => update("roll", e.target.value)} className="cs-input" />
      </FormField>
    </div>
  );
}

/* ============================================================
   SubjectForm.jsx (component) — shared by Add & Edit Subject
   ============================================================ */
function SubjectForm({ initialValues, onClose, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const update = (field, val) => setValues((v) => ({ ...v, [field]: val }));

  const handleSubmit = () => {
    if (!values.name || !values.facultyName || !values.room) {
      setError("Subject name, faculty name, and classroom are required.");
      return;
    }
    setError("");
    onSubmit(values);
  };

  return (
    <ModalShell title={initialValues.id ? "Edit Subject" : "Add Subject"} onClose={onClose} wide>
      <div className="flex flex-col gap-3">
        <FormField label="Subject Name">
          <input type="text" placeholder="e.g. Marketing Management" value={values.name} onChange={(e) => update("name", e.target.value)} className="cs-input" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Subject Code (optional)">
            <input type="text" placeholder="e.g. MG301" value={values.code} onChange={(e) => update("code", e.target.value)} className="cs-input" />
          </FormField>
          <FormField label="Credits (optional)">
            <input type="number" min="0" placeholder="e.g. 4" value={values.credits} onChange={(e) => update("credits", e.target.value)} className="cs-input" />
          </FormField>
        </div>
        <FormField label="Faculty Name">
          <input type="text" placeholder="Enter faculty name" value={values.facultyName} onChange={(e) => update("facultyName", e.target.value)} className="cs-input" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Faculty Email (optional)">
            <input type="email" placeholder="Enter faculty email" value={values.facultyEmail} onChange={(e) => update("facultyEmail", e.target.value)} className="cs-input" />
          </FormField>
          <FormField label="Classroom">
            <input type="text" placeholder="e.g. Room 204" value={values.room} onChange={(e) => update("room", e.target.value)} className="cs-input" />
          </FormField>
        </div>
        <FormField label="Faculty Notes (optional)">
          <textarea rows={2} placeholder="e.g. office hours, preferred contact method" value={values.facultyNotes || ""} onChange={(e) => update("facultyNotes", e.target.value)} className="cs-input" />
        </FormField>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={values.active !== false} onChange={(e) => update("active", e.target.checked)} />
          <span className="text-xs" style={{ color: "var(--text)" }}>
            Active this term
            <span style={{ color: "var(--slate)" }}> — inactive subjects stay in your history but stop appearing in pickers</span>
          </span>
        </label>

        {error && <p className="text-xs" style={{ color: "var(--warn)" }}>{error}</p>}

        <div className="flex gap-2 mt-2">
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--ink)", color: "#fff" }}>
            {initialValues.id ? "Save Changes" : "Add Subject"}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
            Cancel
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   SubjectManagement.jsx (component) — "My Subjects"
   ============================================================ */
function SubjectManagement({ subjects, setSubjects, showToast }) {
  const [modal, setModal] = useState(null); // "add" | "edit" | null
  const [editingId, setEditingId] = useState(null);
  const editingSubject = editingId ? subjects.find((s) => s.id === editingId) : null;

  const handleAdd = (values) => {
    const newSubject = {
      id: `sub-${Date.now()}`,
      facultyId: `fac-${Date.now()}`,
      name: values.name,
      code: values.code || "",
      facultyName: values.facultyName,
      facultyEmail: values.facultyEmail || "",
      facultyNotes: values.facultyNotes || "",
      room: values.room,
      credits: values.credits || "",
      active: values.active !== false,
    };
    setSubjects((prev) => [...prev, newSubject]);
    setModal(null);
    showToast("Subject added.");
  };
  const handleEdit = (values) => {
    setSubjects((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...values, facultyId: s.facultyId } : s)));
    setModal(null);
    setEditingId(null);
    showToast("Subject updated.");
  };
  const handleDelete = (id) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    showToast("Subject deleted. Existing classes/assignments referencing it will show as \"Unknown subject\".");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm" style={{ color: "var(--slate)" }}>
          These subjects are shared across Schedule, Notes, Assignments and Attendance.
        </p>
        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium flex-shrink-0"
          style={{ background: "var(--ink)", color: "#fff" }}
        >
          <Plus size={15} /> Add Subject
        </button>
      </div>

      {subjects.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--slate)" }}>No subjects yet — add your first one above.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subjects.map((s) => (
            <div key={s.id} className="cs-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{s.name}</p>
                  {s.code && <p className="text-[11px]" style={{ color: "var(--slate)" }}>{s.code}</p>}
                </div>
                {s.credits && (
                  <span className="text-[11px] font-medium flex-shrink-0" style={{ color: "var(--slate)" }}>{s.credits} credits</span>
                )}
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--text)" }}>{s.facultyName} · {s.room}</p>
              {s.facultyEmail && <p className="text-[11px] mt-0.5" style={{ color: "var(--slate)" }}>{s.facultyEmail}</p>}
              {s.facultyNotes && <p className="text-[11px] mt-1 italic" style={{ color: "var(--slate)" }}>{s.facultyNotes}</p>}
              {s.active === false && (
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-2" style={{ background: "var(--line)", color: "var(--slate)" }}>
                  Inactive
                </span>
              )}
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => {
                    setEditingId(s.id);
                    setModal("edit");
                  }}
                  className="text-xs font-medium flex items-center gap-1"
                  style={{ color: "var(--gold)" }}
                >
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(s.id)} className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--warn)" }}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal === "add" && (
        <SubjectForm
          initialValues={{ name: "", code: "", facultyName: "", facultyEmail: "", facultyNotes: "", room: "", credits: "", active: true }}
          onClose={() => setModal(null)}
          onSubmit={handleAdd}
        />
      )}
      {modal === "edit" && editingSubject && (
        <SubjectForm initialValues={editingSubject} onClose={() => setModal(null)} onSubmit={handleEdit} />
      )}
    </div>
  );
}

/* ============================================================
   PreferencesForm.jsx (component)
   ============================================================ */
function PreferencesForm({ values, onChange }) {
  const update = (field, val) => onChange({ ...values, [field]: val });
  return (
    <div className="flex flex-col gap-4">
      <FormField label="Time Format">
        <select value={values.timeFormat} onChange={(e) => update("timeFormat", e.target.value)} className="cs-input">
          <option value="12h">12-hour (e.g. 1:00 PM)</option>
          <option value="24h">24-hour (e.g. 13:00)</option>
        </select>
      </FormField>
      <FormField label="Week Starts On">
        <select value={values.weekStart} onChange={(e) => update("weekStart", e.target.value)} className="cs-input">
          <option value="monday">Monday</option>
          <option value="sunday">Sunday</option>
        </select>
      </FormField>
      <FormField label="Default Schedule View">
        <select value={values.defaultCalendarView} onChange={(e) => update("defaultCalendarView", e.target.value)} className="cs-input">
          <option value="Day">Day</option>
          <option value="Week">Week</option>
          <option value="Month">Month</option>
        </select>
      </FormField>
      <FormField label="Default Reminder">
        <select value={values.reminderPreference} onChange={(e) => update("reminderPreference", Number(e.target.value))} className="cs-input">
          {REMINDER_OPTIONS.map((m) => (
            <option key={m} value={m}>{reminderLabel(m)} before</option>
          ))}
        </select>
      </FormField>
      <p className="text-[11px]" style={{ color: "var(--slate)" }}>
        Time format applies everywhere immediately. Week start applies to date calculations; the Schedule's own Week view stays Monday–Saturday by design, matching a typical academic timetable.
      </p>
    </div>
  );
}

/* ============================================================
   ProfilePage.jsx (component) — also used as the "Profile" tab
   inside Settings.
   ============================================================ */
function ProfilePage({ profile, setProfile, showToast }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  const startEdit = () => {
    setDraft(profile);
    setEditing(true);
  };
  const cancel = () => setEditing(false);
  const save = () => {
    setProfile(draft);
    setEditing(false);
    showToast("Profile updated.");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="cs-serif text-lg font-semibold" style={{ color: "var(--ink)" }}>Personal Information</h2>
        {!editing && (
          <button onClick={startEdit} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--gold)" }}>
            <Pencil size={13} /> Edit Profile
          </button>
        )}
      </div>

      {editing ? (
        <ProfileForm values={draft} onChange={setDraft} />
      ) : (
        <div className="flex items-center gap-4 mb-2">
          <Avatar profile={profile} size={56} />
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{profile.name || "Set up your profile"}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--slate)" }}>{profile.email || "No email set"}</p>
            {profile.phone && <p className="text-xs mt-0.5" style={{ color: "var(--slate)" }}>{profile.phone}</p>}
          </div>
        </div>
      )}

      <h2 className="cs-serif text-lg font-semibold mt-6 mb-4" style={{ color: "var(--ink)" }}>Academic Information</h2>
      {editing ? (
        <AcademicInfoForm values={draft} onChange={setDraft} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm" style={{ color: "var(--text)" }}>
          <p><span style={{ color: "var(--slate)" }}>College:</span> {profile.college || "—"}</p>
          <p><span style={{ color: "var(--slate)" }}>Program:</span> {profile.program || "—"}</p>
          <p><span style={{ color: "var(--slate)" }}>Department:</span> {profile.department || "—"}</p>
          <p><span style={{ color: "var(--slate)" }}>Session:</span> {profile.academicSession || "—"}</p>
          <p><span style={{ color: "var(--slate)" }}>Year:</span> {profile.year || "—"}</p>
          <p><span style={{ color: "var(--slate)" }}>Semester:</span> {profile.semester || "—"}</p>
          <p><span style={{ color: "var(--slate)" }}>Section:</span> {profile.section || "—"}</p>
          <p><span style={{ color: "var(--slate)" }}>Roll Number:</span> {profile.roll || "—"}</p>
        </div>
      )}

      {editing && (
        <div className="flex gap-2 mt-5">
          <button onClick={save} className="px-4 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--ink)", color: "#fff" }}>
            Save Changes
          </button>
          <button onClick={cancel} className="px-4 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Onboarding.jsx (component) — optional first-time setup
   ============================================================ */
function Onboarding({ initialProfileValues, onComplete, onSkip }) {
  const [draft, setDraft] = useState(initialProfileValues);
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" style={{ background: "rgba(15,20,32,0.6)" }}>
      <div className="cs-card w-full max-w-lg max-h-[90vh] overflow-y-auto cs-scroll p-6" style={{ background: "var(--panel)" }}>
        <p className="cs-serif text-2xl font-semibold mb-1" style={{ color: "var(--ink)" }}>Welcome to ClassSync 👋</p>
        <p className="text-sm mb-5" style={{ color: "var(--slate)" }}>Let's set up your academic workspace.</p>

        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--slate)" }}>Personal Information</p>
        <ProfileForm values={draft} onChange={setDraft} />

        <p className="text-xs font-semibold uppercase tracking-wide mt-5 mb-2" style={{ color: "var(--slate)" }}>Academic Information</p>
        <AcademicInfoForm values={draft} onChange={setDraft} />

        <div className="flex gap-2 mt-6">
          <button onClick={() => onComplete(draft)} className="flex-1 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--ink)", color: "#fff" }}>
            Get Started
          </button>
          <button onClick={onSkip} className="px-4 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SettingsPage.jsx (component) — Profile / Academic / Subjects
   / Preferences tabs, plus the demo-only Reset Demo Data action.
   ============================================================ */
function SettingsPage({ profile, setProfile, subjects, setSubjects, preferences, setPreferences, onResetDemoData, onRunOnboarding, initialTab }) {
  const [tab, setTab] = useState(initialTab || "Profile");
  const [toast, setToast] = useState("");
  const [confirmingReset, setConfirmingReset] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const tabs = ["Profile", "Academic Information", "Subjects", "Preferences"];

  return (
    <main className="flex-1 px-4 sm:px-8 py-6 max-w-6xl w-full mx-auto">
      <div className="mb-5">
        <h1 className="cs-serif text-[26px] sm:text-[30px] font-semibold" style={{ color: "var(--ink)" }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: "var(--slate)" }}>Manage your profile, academic details, subjects and preferences.</p>
      </div>

      <div className="cs-card p-1 flex items-center gap-1 mb-5 overflow-x-auto" style={{ width: "fit-content", maxWidth: "100%" }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap"
            style={{ background: tab === t ? "var(--ink)" : "transparent", color: tab === t ? "#fff" : "var(--slate)" }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="cs-card p-5 sm:p-6">
        {tab === "Profile" && <ProfilePage profile={profile} setProfile={setProfile} showToast={showToast} />}

        {tab === "Academic Information" && (
          <AcademicOnlyEditor profile={profile} setProfile={setProfile} showToast={showToast} />
        )}

        {tab === "Subjects" && (
          <>
            <h2 className="cs-serif text-lg font-semibold mb-1" style={{ color: "var(--ink)" }}>My Subjects</h2>
            <p className="text-sm mb-4" style={{ color: "var(--slate)" }}>Add, edit, or remove the subjects you're taking this term.</p>
            <SubjectManagement subjects={subjects} setSubjects={setSubjects} showToast={showToast} />
          </>
        )}

        {tab === "Preferences" && (
          <>
            <h2 className="cs-serif text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>Preferences</h2>
            <PreferencesForm values={preferences} onChange={setPreferences} />

            <div className="mt-6 pt-5" style={{ borderTop: "1px solid var(--line)" }}>
              <button onClick={onRunOnboarding} className="text-xs font-medium" style={{ color: "var(--gold)" }}>
                Run first-time setup again
              </button>
            </div>

            <div className="mt-5 pt-5" style={{ borderTop: "1px solid var(--line)" }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--warn)" }}>Development Option</p>
              <button
                onClick={() => setConfirmingReset(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium"
                style={{ background: "var(--warn-tint)", color: "var(--warn)" }}
              >
                <RotateCcw size={13} /> Reset Demo Data
              </button>
              <p className="text-[11px] mt-1.5" style={{ color: "var(--slate)" }}>
                Restores every page's sample/demo data. This is a development-only convenience for this local-state build.
              </p>
            </div>
          </>
        )}
      </div>

      {confirmingReset && (
        <ConfirmDialog
          title="Reset Demo Data"
          message="This restores all sample data (profile, subjects, schedule, notes, assignments, attendance) to its original demo state. Anything you've added or changed will be lost. Continue?"
          confirmLabel="Yes, reset everything"
          tone="danger"
          onConfirm={() => {
            onResetDemoData();
            setConfirmingReset(false);
            showToast("Demo data reset.");
          }}
          onBack={() => setConfirmingReset(false)}
        />
      )}

      <Toast message={toast} />
    </main>
  );
}

// A slimmed-down academic-only view for the Settings "Academic
// Information" tab, reusing the same form/edit pattern as ProfilePage
// without repeating the personal-info section.
function AcademicOnlyEditor({ profile, setProfile, showToast }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="cs-serif text-lg font-semibold" style={{ color: "var(--ink)" }}>Academic Information</h2>
        {!editing && (
          <button
            onClick={() => {
              setDraft(profile);
              setEditing(true);
            }}
            className="flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "var(--gold)" }}
          >
            <Pencil size={13} /> Edit
          </button>
        )}
      </div>
      {editing ? (
        <>
          <AcademicInfoForm values={draft} onChange={setDraft} />
          <div className="flex gap-2 mt-5">
            <button
              onClick={() => {
                setProfile(draft);
                setEditing(false);
                showToast("Academic information updated.");
              }}
              className="px-4 py-2.5 rounded-md text-sm font-medium"
              style={{ background: "var(--ink)", color: "#fff" }}
            >
              Save Changes
            </button>
            <button onClick={() => setEditing(false)} className="px-4 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm" style={{ color: "var(--text)" }}>
          <p><span style={{ color: "var(--slate)" }}>College:</span> {profile.college || "—"}</p>
          <p><span style={{ color: "var(--slate)" }}>Program:</span> {profile.program || "—"}</p>
          <p><span style={{ color: "var(--slate)" }}>Department:</span> {profile.department || "—"}</p>
          <p><span style={{ color: "var(--slate)" }}>Session:</span> {profile.academicSession || "—"}</p>
          <p><span style={{ color: "var(--slate)" }}>Year:</span> {profile.year || "—"}</p>
          <p><span style={{ color: "var(--slate)" }}>Semester:</span> {profile.semester || "—"}</p>
          <p><span style={{ color: "var(--slate)" }}>Section:</span> {profile.section || "—"}</p>
          <p><span style={{ color: "var(--slate)" }}>Roll Number:</span> {profile.roll || "—"}</p>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   ===============  ANNOUNCEMENTS & UPDATES  =======================
   ================================================================
   Step 9. Adds a shared `announcements` list (same pattern as
   classes / notifications / resources / assignments /
   attendanceRecords) plus the page that manages it.

   Three existing systems read this same state, none of them
   duplicated: the Dashboard's Recent Announcements card (via
   deriveDashboardAnnouncements), the Notification Center (via the
   existing addNotification), and the Schedule page (via classId →
   "View Class", reusing the pendingOpenClassId hook already built
   for reminder toasts in Step 4).

   Announcement shape:
     { id, title, message, type, priority, author, authorRole,
       createdAt, createdTime, read, pinned, subjectId, classId }

   type: "general" | "class_update" | "assignment" | "exam" |
         "room_change" | "holiday" | "event" | "important_notice"
   priority: "normal" | "important" | "urgent"
   ================================================================ */

const ANNOUNCEMENT_TYPE_META = {
  general: { emoji: "📢", label: "General" },
  class_update: { emoji: "📅", label: "Class Update" },
  assignment: { emoji: "📝", label: "Assignment" },
  exam: { emoji: "🎓", label: "Exam" },
  room_change: { emoji: "🚪", label: "Room Change" },
  holiday: { emoji: "🌴", label: "Holiday" },
  event: { emoji: "🎤", label: "Event" },
  important_notice: { emoji: "📌", label: "Important Notice" },
};

const ANNOUNCEMENT_PRIORITY_META = {
  normal: { emoji: "⚪", label: "Normal", color: "var(--slate)", tint: "var(--paper)" },
  important: { emoji: "🟠", label: "Important", color: "var(--due-today)", tint: "var(--due-today-tint)" },
  urgent: { emoji: "🔴", label: "Urgent", color: "var(--warn)", tint: "var(--warn-tint)" },
};

// ClassSync is a PERSONAL workspace — there is no CR or admin
// controlling this. Announcements are the student's own record of
// academic notices: ones they write themselves, and ones they've
// logged from faculty/college sources for their own reference.
// Entries authored by the student are editable; logged ones are
// kept read-only so they stay a faithful record of what was said.
const DEMO_AUTHOR = { author: "You", authorRole: "Personal note" };

const announcementsDemoData = [
  {
    id: "an1", title: "Operating Systems class cancelled today", message: "Dr. Kulkarni is unavailable, so today's 1:00 PM Operating Systems class stands cancelled. The session will be compensated with an extra class later this week — watch this space for the schedule.",
    type: "class_update", priority: "urgent", author: "Dept. notice", authorRole: "Logged by you",
    createdAt: TODAY_ISO, createdTime: "09:05", read: false, pinned: true, subjectId: "sub-os", classId: "s17", eventDate: null,
  },
  {
    id: "an2", title: "DBMS lecture moved to Room 210", message: "Today's Database Management Systems lecture has been shifted from Room 204 to Room 210 and now runs 11:00 AM – 12:00 PM instead of 9:00 AM.",
    type: "room_change", priority: "important", author: "Prof. Iyer", authorRole: "Faculty",
    createdAt: TODAY_ISO, createdTime: "08:10", read: false, pinned: false, subjectId: "sub-dbms", classId: "s20", eventDate: null,
  },
  {
    id: "an3", title: "Mid-semester datesheet released", message: "The examination cell has published the mid-semester datesheet. Exams begin on 22 September. Check the notice board or the student portal for your subject-wise schedule and seating arrangement.",
    type: "exam", priority: "important", author: "Examination Cell", authorRole: "Administration",
    createdAt: TODAY_ISO, createdTime: "07:30", read: false, pinned: true, subjectId: null, classId: null, eventDate: "2026-09-22",
  },
  {
    id: "an4", title: "Extra Software Engineering Lab session today", message: "An additional doubt-clearing lab session has been scheduled for 1:00 PM – 3:00 PM in Lab 3, ahead of the project proposal deadline.",
    type: "class_update", priority: "normal", author: "You", authorRole: "Personal note",
    createdAt: TODAY_ISO, createdTime: "08:00", read: true, pinned: false, subjectId: "sub-se", classId: "s21", eventDate: null,
  },
  {
    id: "an5", title: "Guest lecture on Cloud Computing — 12 September", message: "The Department of CSE is hosting a guest lecture on modern cloud architectures. Attendance is open to all Semester 5 students. Venue: Auditorium, 12:30 PM.",
    type: "event", priority: "normal", author: "Dept. of CSE", authorRole: "Administration",
    createdAt: YESTERDAY_ISO, createdTime: "16:45", read: true, pinned: false, subjectId: null, classId: "s24", eventDate: "2026-09-12",
  },
  {
    id: "an6", title: "Project proposal draft due Friday", message: "A reminder that the Software Engineering project proposal draft is due Friday 11 September at 11:59 PM. Late submissions will not be accepted without prior approval.",
    type: "assignment", priority: "important", author: "Prof. Rao", authorRole: "Faculty",
    createdAt: YESTERDAY_ISO, createdTime: "14:20", read: true, pinned: false, subjectId: "sub-se", classId: null, eventDate: null,
  },
  {
    id: "an7", title: "New notes uploaded for Computer Networks", message: "Lecture slides and class notes for the routing algorithms session are now available under Notes & Resources.",
    type: "general", priority: "normal", author: "Dr. Menon", authorRole: "Faculty",
    createdAt: YESTERDAY_ISO, createdTime: "18:15", read: true, pinned: false, subjectId: "sub-cn", classId: "s16", eventDate: null,
  },
  {
    id: "an8", title: "Campus closed on 17 September", message: "The campus will remain closed on Thursday 17 September on account of a public holiday. All classes scheduled for that day stand cancelled and will be rescheduled.",
    type: "holiday", priority: "important", author: "Administration", authorRole: "Administration",
    createdAt: addDaysISO(-2), createdTime: "11:00", read: true, pinned: false, subjectId: null, classId: null, eventDate: "2026-09-17",
  },
  {
    id: "an9", title: "Resume review drive next week", message: "The placement cell is conducting one-on-one resume reviews from 15–19 September. Sign-up sheets are available outside the placement office.",
    type: "general", priority: "normal", author: "Placement Cell", authorRole: "Administration",
    createdAt: addDaysISO(-2), createdTime: "10:30", read: true, pinned: false, subjectId: null, classId: null, eventDate: null,
  },
  {
    id: "an10", title: "Attendance below 75% — advisory", message: "Students whose attendance has fallen below the required 75% in any subject are advised to meet their faculty advisor this week. Shortfall may affect exam eligibility.",
    type: "important_notice", priority: "urgent", author: "Academic Office", authorRole: "Administration",
    createdAt: addDaysISO(-3), createdTime: "09:00", read: true, pinned: false, subjectId: null, classId: null, eventDate: null,
  },
];

/* ------------------------------------------------------------
   Helpers
   ------------------------------------------------------------ */
function formatAnnouncementWhen(a) {
  const dateLabel = parseISODate(a.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  return `${dateLabel} · ${formatTime12(a.createdTime)}`;
}
function matchesAnnouncementQuery(a, q) {
  if (!q || !q.trim()) return true;
  const subjectName = a.subjectId ? getSubjectName(a.subjectId) : "";
  const haystack = [a.title, a.message, a.author, subjectName].filter(Boolean).join(" ").toLowerCase();
  return haystack.includes(q.trim().toLowerCase());
}
// Pinned first, then newest first.
function sortAnnouncements(list) {
  return [...list].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return a.createdAt + a.createdTime < b.createdAt + b.createdTime ? 1 : -1;
  });
}
// Reshapes the shared announcements into exactly what the existing
// (unmodified) Dashboard RecentAnnouncementsCard expects:
// { id, title, source, time }.
function deriveDashboardAnnouncements(list) {
  return sortAnnouncements(list)
    .slice(0, 4)
    .map((a) => ({
      id: a.id,
      title: a.title,
      source: a.author,
      time: a.createdAt === TODAY_ISO ? formatTime12(a.createdTime) : relativeFromToday(a.createdAt),
    }));
}

/* ============================================================
   AnnouncementBadge.jsx (component) — priority pill. Always
   pairs the color with the priority word, never color alone.
   ============================================================ */
function AnnouncementBadge({ priority }) {
  const meta = ANNOUNCEMENT_PRIORITY_META[priority];
  if (priority === "normal") return null; // normal needs no shouting
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 uppercase tracking-wide"
      style={{ background: meta.tint, color: meta.color }}
    >
      {meta.emoji} {meta.label}
    </span>
  );
}

/* ============================================================
   AnnouncementCard.jsx (component)
   ============================================================ */
function AnnouncementCard({ announcement, onClick }) {
  const typeMeta = ANNOUNCEMENT_TYPE_META[announcement.type];
  const isUrgent = announcement.priority === "urgent";
  return (
    <button
      onClick={() => onClick(announcement)}
      className="cs-card w-full text-left p-4 flex flex-col gap-2"
      style={{
        background: announcement.read ? "var(--panel)" : "var(--gold-tint)",
        borderLeft: isUrgent ? "3px solid var(--warn)" : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {announcement.pinned && (
            <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: "var(--gold)" }}>📌 Pinned</span>
          )}
          <AnnouncementBadge priority={announcement.priority} />
          <span className="text-[11px] flex-shrink-0" style={{ color: "var(--slate)" }}>
            {typeMeta.emoji} {typeMeta.label}
          </span>
        </div>
        {!announcement.read && <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: "var(--gold)" }} />}
      </div>

      <p className="text-sm font-semibold leading-snug" style={{ color: "var(--ink)" }}>{announcement.title}</p>
      <p
        className="text-xs leading-snug"
        style={{
          color: "var(--text)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {announcement.message}
      </p>

      <div className="flex items-center justify-between gap-2 flex-wrap mt-0.5">
        <p className="text-[11px]" style={{ color: "var(--slate)" }}>
          {announcement.author} · {announcement.authorRole}
        </p>
        <p className="text-[11px]" style={{ color: "var(--slate)" }}>{formatAnnouncementWhen(announcement)}</p>
      </div>
    </button>
  );
}

/* ============================================================
   AnnouncementSummary.jsx (component)
   ============================================================ */
function AnnouncementSummary({ announcements }) {
  const tiles = [
    { label: "Announcements", value: announcements.length, color: "var(--ink)" },
    { label: "Unread", value: announcements.filter((a) => !a.read).length, color: "var(--gold)" },
    { label: "Important", value: announcements.filter((a) => a.priority === "important").length, color: "var(--due-today)" },
    { label: "Urgent", value: announcements.filter((a) => a.priority === "urgent").length, color: "var(--warn)" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {tiles.map((t) => (
        <div key={t.label} className="cs-card p-4 text-center">
          <p className="cs-serif text-2xl font-semibold" style={{ color: t.color }}>{t.value}</p>
          <p className="text-xs mt-1" style={{ color: "var(--slate)" }}>{t.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   AnnouncementFilters.jsx (component)
   ============================================================ */
function AnnouncementFilters({ status, onStatusChange, type, onTypeChange, subjectId, onSubjectChange, date, onDateChange, isFiltering, onClear }) {
  return (
    <div className="flex flex-col gap-2.5 mb-5">
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "All" },
          { key: "unread", label: "Unread" },
          { key: "normal", label: "Normal" },
          { key: "important", label: "Important" },
          { key: "urgent", label: "Urgent" },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => onStatusChange(opt.key)}
            className="px-3 py-1.5 rounded-md text-xs font-medium"
            style={{
              background: status === opt.key ? "var(--ink)" : "var(--panel)",
              color: status === opt.key ? "#fff" : "var(--ink-soft)",
              border: "1px solid var(--line)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select value={type} onChange={(e) => onTypeChange(e.target.value)} className="cs-input" style={{ width: "auto" }}>
          <option value="all">All Types</option>
          {Object.entries(ANNOUNCEMENT_TYPE_META).map(([key, meta]) => (
            <option key={key} value={key}>{meta.label}</option>
          ))}
        </select>
        <select value={subjectId} onChange={(e) => onSubjectChange(e.target.value)} className="cs-input" style={{ width: "auto" }}>
          <option value="all">All Subjects</option>
          {activeSubjects().map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select value={date} onChange={(e) => onDateChange(e.target.value)} className="cs-input" style={{ width: "auto" }}>
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="older">Older</option>
        </select>
        {isFiltering && (
          <button onClick={onClear} className="text-xs font-medium" style={{ color: "var(--warn)" }}>Clear Filters</button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   AnnouncementDetailsModal.jsx (component)
   ============================================================ */
function AnnouncementDetailsModal({ announcement, classes, onClose, onEdit, onDelete, onTogglePin, onViewClass }) {
  const typeMeta = ANNOUNCEMENT_TYPE_META[announcement.type];
  const priorityMeta = ANNOUNCEMENT_PRIORITY_META[announcement.priority];
  const relatedClass = announcement.classId ? classes.find((c) => c.id === announcement.classId) : null;
  const resolvedClass = relatedClass ? resolveClass(relatedClass) : null;
  const canManage = announcement.author === DEMO_AUTHOR.author;

  return (
    <ModalShell title="Announcement" onClose={onClose} wide>
      <div className="flex items-center gap-2 flex-wrap mb-3">
        {announcement.pinned && <span className="text-[10px] font-semibold" style={{ color: "var(--gold)" }}>📌 Pinned</span>}
        <AnnouncementBadge priority={announcement.priority} />
        <span className="text-[11px]" style={{ color: "var(--slate)" }}>{typeMeta.emoji} {typeMeta.label}</span>
      </div>

      <p className="cs-serif text-lg font-semibold mb-2" style={{ color: "var(--ink)" }}>{announcement.title}</p>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text)" }}>{announcement.message}</p>

      <div className="flex flex-col gap-3 pt-4" style={{ borderTop: "1px solid var(--line)" }}>
        <DetailRow label="Posted by" value={`${announcement.author} · ${announcement.authorRole}`} />
        <DetailRow label="Date & time" value={formatAnnouncementWhen(announcement)} />
        <DetailRow label="Priority" value={<span style={{ color: priorityMeta.color }}>{priorityMeta.emoji} {priorityMeta.label}</span>} />
        <DetailRow label="Type" value={`${typeMeta.emoji} ${typeMeta.label}`} />
        {announcement.subjectId && <DetailRow label="Subject" value={getSubjectName(announcement.subjectId)} />}
      </div>

      {resolvedClass && (
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--line)" }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--slate)" }}>Related Class</p>
          <div className="flex flex-col gap-2">
            <DetailRow label="Subject" value={resolvedClass.subject} />
            <DetailRow label="Date" value={formatLongDate(parseISODate(resolvedClass.date))} />
            <DetailRow label="Time" value={`${formatTime12(resolvedClass.startTime)} – ${formatTime12(resolvedClass.endTime)}`} />
            <DetailRow label="Room" value={resolvedClass.room} />
            <DetailRow
              label="Status"
              value={
                <span style={{ color: STATUS_META[resolvedClass.status].color }}>
                  {STATUS_META[resolvedClass.status].dot} {STATUS_META[resolvedClass.status].label}
                </span>
              }
            />
          </div>
          <button
            onClick={() => onViewClass(resolvedClass.id)}
            className="mt-3 text-xs font-medium flex items-center gap-1"
            style={{ color: "var(--gold)" }}
          >
            View Class <ArrowUpRight size={12} />
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: "1px solid var(--line)" }}>
        <button
          onClick={() => onTogglePin(announcement.id)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium"
          style={{ background: "var(--gold-tint)", color: "#8A6A1F" }}
        >
          <Pin size={13} /> {announcement.pinned ? "Unpin" : "Pin"}
        </button>
        {canManage && (
          <>
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium"
              style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}
            >
              <Pencil size={13} /> Edit
            </button>
            <button
              onClick={() => onDelete(announcement.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium"
              style={{ background: "var(--warn-tint)", color: "var(--warn)" }}
            >
              <Trash2 size={13} /> Delete
            </button>
          </>
        )}
      </div>
      {!canManage && (
        <p className="text-[11px] mt-2" style={{ color: "var(--slate)" }}>
          Logged from an external source, so it's kept read-only as a record of what was announced. You can still pin it.
        </p>
      )}
    </ModalShell>
  );
}

/* ============================================================
   CreateAnnouncementModal.jsx (component) — shared by Create & Edit
   ============================================================ */
function CreateAnnouncementModal({ mode, initialValues, classes, onClose, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const update = (field, val) => setValues((v) => ({ ...v, [field]: val }));

  // Only offer classes belonging to the chosen subject, so the
  // announcement can reference a real class by id.
  const classOptions = values.subjectId ? classes.filter((c) => c.subjectId === values.subjectId) : [];

  const handleSubmit = () => {
    if (!values.title || !values.message || !values.type || !values.priority) {
      setError("Title, message, type and priority are required.");
      return;
    }
    if (mode === "create" && (!values.createdAt || !values.createdTime)) {
      setError("Please provide a date and time.");
      return;
    }
    setError("");
    onSubmit(values);
  };

  return (
    <ModalShell title={mode === "create" ? "Create Announcement" : "Edit Announcement"} onClose={onClose} wide>
      <div className="flex flex-col gap-3">
        <FormField label="Title">
          <input type="text" placeholder="Enter a short, clear title" value={values.title} onChange={(e) => update("title", e.target.value)} className="cs-input" />
        </FormField>
        <FormField label="Message">
          <textarea rows={4} placeholder="Write the full announcement" value={values.message} onChange={(e) => update("message", e.target.value)} className="cs-input" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Type">
            <select value={values.type} onChange={(e) => update("type", e.target.value)} className="cs-input">
              {Object.entries(ANNOUNCEMENT_TYPE_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Priority">
            <select value={values.priority} onChange={(e) => update("priority", e.target.value)} className="cs-input">
              {Object.entries(ANNOUNCEMENT_PRIORITY_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </FormField>
        </div>
        {["exam", "holiday", "event", "important_notice"].includes(values.type) && (
          <FormField label="Event Date (optional — shows this on the Academic Calendar)">
            <input type="date" value={values.eventDate || ""} onChange={(e) => update("eventDate", e.target.value || null)} className="cs-input" />
          </FormField>
        )}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Related Subject (optional)">
            <select
              value={values.subjectId || ""}
              onChange={(e) => {
                update("subjectId", e.target.value || null);
                update("classId", null);
              }}
              className="cs-input"
            >
              <option value="">None</option>
              {activeSubjects().map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Related Class (optional)">
            <select value={values.classId || ""} onChange={(e) => update("classId", e.target.value || null)} className="cs-input" disabled={classOptions.length === 0}>
              <option value="">{values.subjectId ? (classOptions.length === 0 ? "No classes for this subject" : "None") : "Pick a subject first"}</option>
              {classOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {formatDayNum(parseISODate(c.date))} · {c.startTime}–{c.endTime} · {c.room}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        {mode === "create" && (
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Date">
              <input type="date" value={values.createdAt} onChange={(e) => update("createdAt", e.target.value)} className="cs-input" />
            </FormField>
            <FormField label="Time">
              <input type="time" value={values.createdTime} onChange={(e) => update("createdTime", e.target.value)} className="cs-input" />
            </FormField>
          </div>
        )}

        {error && <p className="text-xs" style={{ color: "var(--warn)" }}>{error}</p>}

        <div className="flex gap-2 mt-2">
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--ink)", color: "#fff" }}>
            {mode === "create" ? "Post Announcement" : "Save Changes"}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
            Cancel
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   AnnouncementsPage.jsx (component) — owns search/filter/modal
   state. `announcements`/`setAnnouncements` are shared from App.
   ============================================================ */
function AnnouncementsPage({ announcements, setAnnouncements, classes, onNotify, onViewClass, autoOpenAdd, onAutoOpenHandled, pendingOpenAnnouncementId, onPendingOpenHandled }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [modal, setModal] = useState(null); // "create" | "edit" | "details" | "confirm-delete" | null
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const isFiltering = query.trim() !== "" || statusFilter !== "all" || typeFilter !== "all" || subjectFilter !== "all" || dateFilter !== "all";
  // Quick action from the Control Center — opens this page's own
  // existing add modal rather than duplicating the form there.
  useEffect(() => {
    if (!autoOpenAdd) return;
    setModal("create");
    onAutoOpenHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenAdd]);


  const matchesStatus = (a) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "unread") return !a.read;
    return a.priority === statusFilter;
  };
  const matchesDate = (a) => {
    if (dateFilter === "all") return true;
    const weekStartIso = toISODate(CURRENT_WEEK_START);
    const weekEndIso = toISODate(addDays(CURRENT_WEEK_START, 6));
    if (dateFilter === "today") return a.createdAt === TODAY_ISO;
    if (dateFilter === "week") return a.createdAt >= weekStartIso && a.createdAt <= weekEndIso;
    if (dateFilter === "older") return a.createdAt < weekStartIso;
    return true;
  };

  const filtered = sortAnnouncements(
    announcements.filter(
      (a) =>
        matchesAnnouncementQuery(a, query) &&
        matchesStatus(a) &&
        (typeFilter === "all" || a.type === typeFilter) &&
        (subjectFilter === "all" || a.subjectId === subjectFilter) &&
        matchesDate(a)
    )
  );

  const clearFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSubjectFilter("all");
    setDateFilter("all");
  };

  const selected = selectedId ? announcements.find((a) => a.id === selectedId) : null;
  const pendingDelete = pendingDeleteId ? announcements.find((a) => a.id === pendingDeleteId) : null;

  // Opening an announcement marks it read — that's the read/unread
  // signal, and it flows straight through to the Dashboard.
  const openDetails = (a) => {
    setSelectedId(a.id);
    setModal("details");
    if (!a.read) {
      setAnnouncements((prev) => prev.map((x) => (x.id === a.id ? { ...x, read: true } : x)));
    }
  };
  const closeModal = () => {
    setModal(null);
    setSelectedId(null);
  };

  // Jumped here from another page (e.g. the Academic Calendar) to
  // view one specific announcement — opens the same details modal
  // this page already has.
  useEffect(() => {
    if (!pendingOpenAnnouncementId) return;
    const a = announcements.find((x) => x.id === pendingOpenAnnouncementId);
    if (a) openDetails(a);
    onPendingOpenHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingOpenAnnouncementId]);

  const markAllRead = () => {
    setAnnouncements((prev) => prev.map((a) => ({ ...a, read: true })));
    showToast("All announcements marked as read.");
  };
  const handleTogglePin = (id) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a)));
  };

  const handleCreate = (values) => {
    const newAnnouncement = {
      id: `an-${Date.now()}`,
      title: values.title,
      message: values.message,
      type: values.type,
      priority: values.priority,
      author: DEMO_AUTHOR.author,
      authorRole: DEMO_AUTHOR.authorRole,
      createdAt: values.createdAt,
      createdTime: values.createdTime,
      read: true, // authored by you, so it isn't "unread" to you
      pinned: false,
      subjectId: values.subjectId || null,
      classId: values.classId || null,
      eventDate: values.eventDate || null,
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    setModal(null);
    showToast("Announcement posted.");

    // Reuses the existing notification system — no second one.
    const isUrgent = values.priority === "urgent";
    onNotify({
      type: isUrgent ? "urgent_announcement" : "announcement",
      title: isUrgent ? "Urgent Announcement" : "New Announcement",
      message: values.title,
      relatedClassId: values.classId || null,
    });
  };

  const handleEdit = (values) => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === selectedId
          ? { ...a, title: values.title, message: values.message, type: values.type, priority: values.priority, subjectId: values.subjectId || null, classId: values.classId || null, eventDate: values.eventDate || null }
          : a
      )
    );
    setModal(null);
    setSelectedId(null);
    showToast("Announcement updated.");
  };

  const handleConfirmDelete = () => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== pendingDeleteId));
    setPendingDeleteId(null);
    setModal(null);
    setSelectedId(null);
    showToast("Announcement deleted.");
  };

  const unreadCount = announcements.filter((a) => !a.read).length;

  return (
    <main className="flex-1 px-4 sm:px-8 py-6 max-w-6xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="cs-serif text-[26px] sm:text-[30px] font-semibold" style={{ color: "var(--ink)" }}>Announcements</h1>
          <p className="text-sm mt-1" style={{ color: "var(--slate)" }}>Stay updated with important academic information.</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-3.5 py-2.5 rounded-lg text-sm font-medium"
              style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}
            >
              Mark all as read
            </button>
          )}
          <button
            onClick={() => setModal("create")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium"
            style={{ background: "var(--ink)", color: "#fff" }}
          >
            <Plus size={16} /> Create
          </button>
        </div>
      </div>

      <div
        className="mb-4 px-4 py-2.5 rounded-lg text-xs flex items-center gap-2"
        style={{ background: "var(--gold-tint)", border: "1px solid var(--gold-tint-line)", color: "var(--ink-soft)" }}
      >
        <Info size={13} /> Sample data — this is your personal notice board. Entries you write are editable; ones logged from faculty or college sources stay read-only as a record.
      </div>

      <AnnouncementSummary announcements={announcements} />

      <div className="mb-4">
        <NotesSearch value={query} onChange={setQuery} placeholder="Search announcements…" />
      </div>

      <AnnouncementFilters
        status={statusFilter}
        onStatusChange={setStatusFilter}
        type={typeFilter}
        onTypeChange={setTypeFilter}
        subjectId={subjectFilter}
        onSubjectChange={setSubjectFilter}
        date={dateFilter}
        onDateChange={setDateFilter}
        isFiltering={isFiltering}
        onClear={clearFilters}
      />

      {filtered.length === 0 ? (
        <NotesEmptyState onClear={clearFilters} message="No announcements found." />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} onClick={openDetails} />
          ))}
        </div>
      )}

      {modal === "create" && (
        <CreateAnnouncementModal
          mode="create"
          initialValues={{ title: "", message: "", type: "general", priority: "normal", subjectId: null, classId: null, eventDate: null, createdAt: TODAY_ISO, createdTime: "09:00" }}
          classes={classes}
          onClose={() => setModal(null)}
          onSubmit={handleCreate}
        />
      )}
      {modal === "edit" && selected && (
        <CreateAnnouncementModal
          mode="edit"
          initialValues={{ title: selected.title, message: selected.message, type: selected.type, priority: selected.priority, subjectId: selected.subjectId, classId: selected.classId, eventDate: selected.eventDate || null }}
          classes={classes}
          onClose={() => setModal("details")}
          onSubmit={handleEdit}
        />
      )}
      {modal === "details" && selected && (
        <AnnouncementDetailsModal
          announcement={selected}
          classes={classes}
          onClose={closeModal}
          onEdit={() => setModal("edit")}
          onDelete={(id) => {
            setPendingDeleteId(id);
            setModal("confirm-delete");
          }}
          onTogglePin={handleTogglePin}
          onViewClass={(classId) => {
            closeModal();
            onViewClass(classId);
          }}
        />
      )}
      {modal === "confirm-delete" && pendingDelete && (
        <ConfirmDialog
          title="Delete Announcement"
          message="Are you sure you want to delete this announcement? This cannot be undone."
          confirmLabel="Yes, delete it"
          tone="danger"
          onConfirm={handleConfirmDelete}
          onBack={() => {
            setPendingDeleteId(null);
            setModal("details");
          }}
        />
      )}

      <Toast message={toast} />
    </main>
  );
}

/* ================================================================
   ==============  PERSONAL CONTROL CENTER  ========================
   ================================================================
   Step 10. ClassSync is a PERSONAL academic app — one student, one
   independent workspace. There are no CR/admin roles, no class
   codes, no shared data. This page is that student's command
   center: everything that configures their own workspace, in one
   place.

   It deliberately owns NO data of its own. Every section reads and
   writes the same centralized state already used by the rest of the
   app (profile / subjects / preferences / classes / assignments /
   resources / attendanceRecords), and reuses the existing forms and
   modals rather than duplicating them. Changing a subject here is
   the same as changing it in Settings — because it is literally the
   same component over the same state.

   Future multi-user note: because every piece of state lives in
   App() and is passed down, swapping the seed values for a
   per-user fetch later (User A → A's data) is a change at one
   level, not a rewrite of these pages.
   ================================================================ */

/* ============================================================
   AcademicSummaryStrip.jsx (component) — all values derived from
   existing state, nothing duplicated or faked.
   ============================================================ */
function AcademicSummaryStrip({ profile, subjects, classes, assignments, attendanceRecords }) {
  const weekStartIso = toISODate(CURRENT_WEEK_START);
  const weekEndIso = toISODate(addDays(CURRENT_WEEK_START, 6));
  const classesThisWeek = classes.filter(
    (c) => c.date >= weekStartIso && c.date <= weekEndIso && c.status !== "cancelled"
  ).length;
  const upcomingAssignments = assignments.filter((a) => getDisplayStatus(a) !== "completed" && getDisplayStatus(a) !== "submitted").length;
  const overall = Math.round(computeAttendanceStats(attendanceRecords).percentage);
  const activeCount = subjects.filter((s) => s.active !== false).length;

  const tiles = [
    { label: "Current Semester", value: profile.semester || "—", color: "var(--ink)" },
    { label: "Subjects", value: activeCount, color: "var(--ink)" },
    { label: "Classes This Week", value: classesThisWeek, color: "var(--info)" },
    { label: "Upcoming Assignments", value: upcomingAssignments, color: "var(--due-today)" },
    { label: "Overall Attendance", value: `${overall}%`, color: overall >= requiredAttendance() ? "var(--good)" : "var(--warn)" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
      {tiles.map((t) => (
        <div key={t.label} className="cs-card p-4">
          <p className="cs-serif text-xl font-semibold truncate" style={{ color: t.color }}>{t.value}</p>
          <p className="text-[11px] mt-1" style={{ color: "var(--slate)" }}>{t.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   QuickActions.jsx (component) — shortcuts that open the EXISTING
   modals/pages. No duplicate forms are defined here.
   ============================================================ */
function QuickActions({ onAction }) {
  const actions = [
    { key: "subject", label: "Add Subject", icon: BookOpen },
    { key: "class", label: "Add Class", icon: CalendarClock },
    { key: "assignment", label: "Add Assignment", icon: ClipboardList },
    { key: "resource", label: "Add Resource", icon: NotebookPen },
    { key: "attendance", label: "Mark Attendance", icon: CheckSquare },
    { key: "event", label: "Add Academic Event", icon: CalendarRange },
    { key: "announcement", label: "New Note", icon: Megaphone },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {actions.map((a) => {
        const Icon = a.icon;
        return (
          <button
            key={a.key}
            onClick={() => onAction(a.key)}
            className="cs-card p-3 flex flex-col items-center gap-1.5 text-center"
          >
            <Icon size={17} strokeWidth={1.8} style={{ color: "var(--gold)" }} />
            <span className="text-[11px] font-medium leading-tight" style={{ color: "var(--ink)" }}>{a.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   ReminderPreferencesForm.jsx (component)
   ============================================================ */
function ReminderPreferencesForm({ values, onChange }) {
  const update = (field, val) => onChange({ ...values, [field]: val });
  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={values.remindersEnabled} onChange={(e) => update("remindersEnabled", e.target.checked)} />
        <span className="text-sm" style={{ color: "var(--text)" }}>Enable class reminders</span>
      </label>

      <div>
        <p className="text-xs font-medium mb-2" style={{ color: "var(--slate)" }}>Default reminder time</p>
        <div className="flex flex-wrap gap-2">
          {REMINDER_OPTIONS.map((m) => (
            <button
              key={m}
              onClick={() => update("reminderPreference", m)}
              disabled={!values.remindersEnabled}
              className="px-3 py-1.5 rounded-md text-xs font-medium"
              style={{
                background: values.reminderPreference === m ? "var(--gold)" : "var(--paper)",
                color: values.reminderPreference === m ? "#fff" : "var(--ink-soft)",
                border: "1px solid var(--line)",
                opacity: values.remindersEnabled ? 1 : 0.5,
              }}
            >
              {reminderLabel(m)} before
            </button>
          ))}
        </div>
      </div>

      <p className="text-[11px]" style={{ color: "var(--slate)" }}>
        This sets the default offset applied when you tap "Set Reminder" on a class. Existing per-class reminders keep whatever you chose for them. Reminders appear inside ClassSync — browser push notifications come later.
      </p>
    </div>
  );
}

/* ============================================================
   AttendancePreferencesForm.jsx (component)
   ============================================================ */
function AttendancePreferencesForm({ values, onChange, attendanceRecords }) {
  const required = values.requiredAttendance;
  const overall = Math.round(computeAttendanceStats(attendanceRecords).percentage);
  const belowCount = activeSubjects().filter((s) => {
    const stats = computeAttendanceStats(attendanceRecords.filter((r) => r.subjectId === s.id));
    return stats.total > 0 && stats.percentage < required;
  }).length;

  return (
    <div className="flex flex-col gap-4">
      <FormField label="Required attendance percentage">
        <input
          type="number"
          min="0"
          max="100"
          value={required}
          onChange={(e) => onChange({ ...values, requiredAttendance: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
          className="cs-input"
          style={{ maxWidth: "140px" }}
        />
      </FormField>

      <div className="cs-card p-4" style={{ background: "var(--paper)" }}>
        <p className="text-xs mb-1" style={{ color: "var(--slate)" }}>With this requirement, right now:</p>
        <p className="text-sm" style={{ color: "var(--text)" }}>
          Your overall attendance is{" "}
          <span style={{ color: overall >= required ? "var(--good)" : "var(--warn)", fontWeight: 600 }}>{overall}%</span>
          {belowCount > 0 ? (
            <> and <span style={{ color: "var(--warn)", fontWeight: 600 }}>{belowCount} subject{belowCount !== 1 ? "s are" : " is"}</span> below the requirement.</>
          ) : (
            <> and every subject meets the requirement.</>
          )}
        </p>
      </div>

      <p className="text-[11px]" style={{ color: "var(--slate)" }}>
        Every attendance calculation uses this value — the status tiers, the "classes needed to catch up" and "classes you can miss" figures, and the Dashboard's attendance card all recalculate immediately. "Safe" means 5 points or more above your requirement.
      </p>
    </div>
  );
}

/* ============================================================
   PersonalizationForm.jsx (component)
   ============================================================ */
function PersonalizationForm({ values, onChange }) {
  const update = (field, val) => onChange({ ...values, [field]: val });
  const toggles = [
    { key: "showUpcomingAssignments", label: "Show upcoming assignments on the dashboard" },
    { key: "showAttendanceWarnings", label: "Show important updates & attendance warnings" },
    { key: "showAnnouncements", label: "Show recent announcements on the dashboard" },
  ];
  return (
    <div className="flex flex-col gap-4">
      <FormField label="Dashboard greeting">
        <input
          type="text"
          placeholder="Leave empty for automatic (Good morning / afternoon / evening)"
          value={values.greeting}
          onChange={(e) => update("greeting", e.target.value)}
          className="cs-input"
        />
      </FormField>

      <div className="flex flex-col gap-2.5">
        {toggles.map((t) => (
          <label key={t.key} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={values[t.key]} onChange={(e) => update(t.key, e.target.checked)} />
            <span className="text-sm" style={{ color: "var(--text)" }}>{t.label}</span>
          </label>
        ))}
      </div>

      <FormField label="Default schedule view">
        <select value={values.defaultCalendarView} onChange={(e) => update("defaultCalendarView", e.target.value)} className="cs-input" style={{ maxWidth: "200px" }}>
          <option value="Day">Day</option>
          <option value="Week">Week</option>
          <option value="Month">Month</option>
        </select>
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Time format">
          <select value={values.timeFormat} onChange={(e) => update("timeFormat", e.target.value)} className="cs-input">
            <option value="12h">12-hour (1:00 PM)</option>
            <option value="24h">24-hour (13:00)</option>
          </select>
        </FormField>
        <FormField label="Week starts on">
          <select value={values.weekStart} onChange={(e) => update("weekStart", e.target.value)} className="cs-input">
            <option value="monday">Monday</option>
            <option value="sunday">Sunday</option>
          </select>
        </FormField>
      </div>
    </div>
  );
}

/* ============================================================
   DataManagement.jsx (component)
   ============================================================ */
function DataManagement({ onResetDemoData, onResetAcademicSetup, onClearLocalData }) {
  const [confirming, setConfirming] = useState(null);

  const actions = [
    {
      key: "demo",
      label: "Reset Demo Data",
      description: "Restores every page's original sample data — schedule, notes, assignments, attendance, announcements, subjects and profile.",
      confirmTitle: "Reset Demo Data",
      confirmMessage: "This restores all the original sample data in your ClassSync workspace on this device. Anything you've added or changed will be lost. Continue?",
      confirmLabel: "Yes, restore sample data",
      run: onResetDemoData,
    },
    {
      key: "academic",
      label: "Reset Academic Setup",
      description: "Clears your profile and subjects only. Your schedule, notes, assignments and attendance records stay as they are.",
      confirmTitle: "Reset Academic Setup",
      confirmMessage: "This clears your personal details and your subject list on this device. Your schedule, notes, assignments and attendance records are kept — but they'll show \"Unknown subject\" until you add subjects again. Continue?",
      confirmLabel: "Yes, clear my setup",
      run: onResetAcademicSetup,
    },
    {
      key: "clear",
      label: "Clear Local Data",
      description: "Empties everything — an entirely blank ClassSync to start from scratch.",
      confirmTitle: "Clear Local Data",
      confirmMessage: "This empties your entire ClassSync workspace on this device: profile, subjects, schedule, notes, assignments, attendance, announcements and notifications. Nothing is recoverable. Continue?",
      confirmLabel: "Yes, clear everything",
      run: onClearLocalData,
    },
  ];

  const active = confirming ? actions.find((a) => a.key === confirming) : null;

  return (
    <div>
      <div
        className="mb-4 px-4 py-2.5 rounded-lg text-xs flex items-start gap-2"
        style={{ background: "var(--info-tint)", border: "1px solid #CFE0EF", color: "var(--ink-soft)" }}
      >
        <Info size={13} className="flex-shrink-0 mt-0.5" />
        <span>
          These actions affect only your own ClassSync data on this device. Nothing is stored on a server, and nothing here touches anyone else. Since there's no cloud backup yet, resets can't be undone.
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {actions.map((a) => (
          <div key={a.key} className="cs-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>{a.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--slate)" }}>{a.description}</p>
            </div>
            <button
              onClick={() => setConfirming(a.key)}
              className="px-3 py-2 rounded-md text-xs font-medium flex-shrink-0 self-start sm:self-auto"
              style={{ background: "var(--warn-tint)", color: "var(--warn)" }}
            >
              {a.label}
            </button>
          </div>
        ))}
      </div>

      {active && (
        <ConfirmDialog
          title={active.confirmTitle}
          message={active.confirmMessage}
          confirmLabel={active.confirmLabel}
          tone="danger"
          onConfirm={() => {
            active.run();
            setConfirming(null);
          }}
          onBack={() => setConfirming(null)}
        />
      )}
    </div>
  );
}

/* ============================================================
   ControlCenterPage.jsx (component) — owns only its own tab/toast
   UI state; all real data comes from App.
   ============================================================ */
function ControlCenterPage({
  profile, setProfile,
  subjects, setSubjects,
  preferences, setPreferences,
  classes, assignments, attendanceRecords,
  onQuickAction,
  onResetDemoData, onResetAcademicSetup, onClearLocalData,
  subjectHint,
}) {
  const [section, setSection] = useState("Academic Setup");
  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // "Add Subject" quick action — subject management is on this very
  // page, so jump to that section instead of navigating away.
  useEffect(() => {
    if (subjectHint) setSection("Subjects & Faculty");
  }, [subjectHint]);

  const sections = [
    { key: "Academic Setup", icon: GraduationCap },
    { key: "Subjects & Faculty", icon: BookOpen },
    { key: "Reminders", icon: Bell },
    { key: "Attendance", icon: CheckSquare },
    { key: "Personalization", icon: SlidersHorizontal },
    { key: "Data", icon: Database },
  ];

  return (
    <main className="flex-1 px-4 sm:px-8 py-6 max-w-6xl w-full mx-auto">
      <div className="mb-5">
        <h1 className="cs-serif text-[26px] sm:text-[30px] font-semibold" style={{ color: "var(--ink)" }}>
          Personal Control Center
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--slate)" }}>
          Everything that shapes your own ClassSync workspace, in one place.
        </p>
      </div>

      <AcademicSummaryStrip
        profile={profile}
        subjects={subjects}
        classes={classes}
        assignments={assignments}
        attendanceRecords={attendanceRecords}
      />

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide mb-2.5 flex items-center gap-1.5" style={{ color: "var(--slate)" }}>
          <Zap size={12} /> Quick Actions
        </p>
        <QuickActions onAction={onQuickAction} />
      </div>

      <div className="cs-card p-1 flex items-center gap-1 mb-5 overflow-x-auto" style={{ maxWidth: "100%" }}>
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className="px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap flex items-center gap-1.5"
              style={{ background: section === s.key ? "var(--ink)" : "transparent", color: section === s.key ? "#fff" : "var(--slate)" }}
            >
              <Icon size={13} /> {s.key}
            </button>
          );
        })}
      </div>

      <div className="cs-card p-5 sm:p-6">
        {section === "Academic Setup" && (
          <ProfilePage profile={profile} setProfile={setProfile} showToast={showToast} />
        )}

        {section === "Subjects & Faculty" && (
          <>
            <h2 className="cs-serif text-lg font-semibold mb-1" style={{ color: "var(--ink)" }}>Subjects & Faculty</h2>
            <p className="text-sm mb-4" style={{ color: "var(--slate)" }}>
              Your subjects, and the faculty details you want to keep handy for each. This is personal reference — nothing is shared.
            </p>
            <SubjectManagement subjects={subjects} setSubjects={setSubjects} showToast={showToast} />
          </>
        )}

        {section === "Reminders" && (
          <>
            <h2 className="cs-serif text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>Reminder Preferences</h2>
            <ReminderPreferencesForm values={preferences} onChange={setPreferences} />
          </>
        )}

        {section === "Attendance" && (
          <>
            <h2 className="cs-serif text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>Attendance Requirement</h2>
            <AttendancePreferencesForm values={preferences} onChange={setPreferences} attendanceRecords={attendanceRecords} />
          </>
        )}

        {section === "Personalization" && (
          <>
            <h2 className="cs-serif text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>Personalization</h2>
            <PersonalizationForm values={preferences} onChange={setPreferences} />
          </>
        )}

        {section === "Data" && (
          <>
            <h2 className="cs-serif text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>Data Management</h2>
            <DataManagement
              onResetDemoData={() => {
                onResetDemoData();
                showToast("Sample data restored.");
              }}
              onResetAcademicSetup={() => {
                onResetAcademicSetup();
                showToast("Academic setup cleared.");
              }}
              onClearLocalData={() => {
                onClearLocalData();
                showToast("Local data cleared.");
              }}
            />
          </>
        )}
      </div>

      <Toast message={toast} />
    </main>
  );
}

/* ================================================================
   ===============  ACADEMIC CALENDAR  =============================
   ================================================================
   Step 11. Owns exactly one new dataset — `academicEvents`, the
   student's own personal entries (exams, vivas, study sessions,
   reminders). Everything else on this page — classes, assignments,
   announcements — is pulled live from the SAME shared state used by
   Schedule/Assignments/Announcements via buildCalendarEvents(), a
   read-only transformation layer. Nothing is copied.

   Clicking a class/assignment/announcement event navigates to that
   page and opens ITS OWN existing details modal (via the same
   pendingOpen*Id hooks already built for Schedule in Step 4, and
   just added above for Assignments/Announcements) — there is no
   second details system for any of them. Only personal events get
   a details/edit modal here, because that data doesn't exist
   anywhere else.

   Personal event shape:
     { id, title, date, startTime, endTime, type, description,
       subjectId, createdAt }
   type: "exam" | "viva" | "presentation" | "quiz" | "seminar" |
         "college_event" | "study_session" | "reminder"
   ================================================================ */

const PERSONAL_EVENT_TYPE_META = {
  exam: { emoji: "🎓", label: "Exam", bucket: "exam_event" },
  viva: { emoji: "🗣️", label: "Viva", bucket: "exam_event" },
  presentation: { emoji: "📽️", label: "Presentation", bucket: "exam_event" },
  quiz: { emoji: "📝", label: "Quiz", bucket: "exam_event" },
  seminar: { emoji: "🎤", label: "Seminar", bucket: "exam_event" },
  college_event: { emoji: "🏫", label: "College Event", bucket: "exam_event" },
  study_session: { emoji: "📚", label: "Study Session", bucket: "reminder" },
  reminder: { emoji: "📌", label: "Important Reminder", bucket: "reminder" },
};

// One color/label per calendar filter checkbox — five categories,
// matching the five filters the brief asks for.
const CALENDAR_CATEGORY_META = {
  class: { label: "Classes", color: "var(--gold)" },
  assignment: { label: "Assignments", color: "var(--due-today)" },
  announcement: { label: "Announcements", color: "var(--info)" },
  exam_event: { label: "Exams & Events", color: "var(--extra)" },
  reminder: { label: "Personal Reminders", color: "var(--resched)" },
};

// Announcement types that represent a standalone dated happening —
// the rest (general/class_update/room_change/assignment) are
// already represented via Classes/Assignments directly, so showing
// them again here would just duplicate those entries.
const CALENDAR_ELIGIBLE_ANNOUNCEMENT_TYPES = ["exam", "holiday", "event", "important_notice"];

const academicEventsDemoData = [
  { id: "pe1", title: "Study session — ER diagrams & normalization", type: "study_session", date: TODAY_ISO, startTime: "18:00", endTime: "19:30", subjectId: "sub-dbms", description: "Review before the next DBMS class.", createdAt: TODAY_ISO },
  { id: "pe2", title: "DSA Viva", type: "viva", date: addDaysISO(4), startTime: "11:00", endTime: "12:00", subjectId: "sub-dsa", description: "Covers BST operations and sorting algorithms.", createdAt: TODAY_ISO },
  { id: "pe3", title: "Buy semester lab manual", type: "reminder", date: addDaysISO(1), startTime: "10:00", endTime: null, subjectId: null, description: "", createdAt: TODAY_ISO },
  { id: "pe4", title: "Department Tech Fest", type: "college_event", date: addDaysISO(6), startTime: "10:00", endTime: "17:00", subjectId: null, description: "Annual department fest — workshops and coding contests.", createdAt: TODAY_ISO },
];

/* ------------------------------------------------------------
   The transformation layer — reads the shared data, never
   copies it. Every event carries a `sourceId` back to its real
   record, and a `category` used both for filtering and coloring.
   ------------------------------------------------------------ */
function buildCalendarEvents({ classes, assignments, announcements, personalEvents, filters }) {
  const events = [];

  if (filters.classes) {
    classes.forEach((c) => {
      const r = resolveClass(c);
      const meta = STATUS_META[r.status];
      events.push({
        id: `cal-class-${c.id}`, category: "class", date: r.date, startTime: r.startTime, endTime: r.endTime,
        title: r.subject, subtitle: `${r.faculty} · ${r.room}`, emoji: meta.dot, color: meta.color, sourceId: c.id,
      });
    });
  }
  if (filters.assignments) {
    assignments
      .filter((a) => getDisplayStatus(a) !== "completed")
      .forEach((a) => {
        const urgency = computeUrgency(a);
        const urgMeta = urgency ? URGENCY_META[urgency] : null;
        events.push({
          id: `cal-assignment-${a.id}`, category: "assignment", date: a.deadlineDate, startTime: a.deadlineTime, endTime: null,
          title: a.title, subtitle: getSubjectName(a.subjectId), emoji: urgMeta ? urgMeta.emoji : "📝",
          color: CALENDAR_CATEGORY_META.assignment.color, sourceId: a.id,
        });
      });
  }
  if (filters.announcements) {
    announcements
      .filter((an) => an.eventDate && CALENDAR_ELIGIBLE_ANNOUNCEMENT_TYPES.includes(an.type))
      .forEach((an) => {
        const typeMeta = ANNOUNCEMENT_TYPE_META[an.type];
        events.push({
          id: `cal-announcement-${an.id}`, category: "announcement", date: an.eventDate, startTime: null, endTime: null,
          title: an.title, subtitle: typeMeta.label, emoji: typeMeta.emoji,
          color: CALENDAR_CATEGORY_META.announcement.color, sourceId: an.id,
        });
      });
  }
  if (filters.examEvents || filters.reminders) {
    personalEvents.forEach((pe) => {
      const meta = PERSONAL_EVENT_TYPE_META[pe.type];
      if (meta.bucket === "exam_event" && !filters.examEvents) return;
      if (meta.bucket === "reminder" && !filters.reminders) return;
      events.push({
        id: `cal-personal-${pe.id}`, category: meta.bucket, date: pe.date, startTime: pe.startTime, endTime: pe.endTime,
        title: pe.title, subtitle: pe.subjectId ? getSubjectName(pe.subjectId) : meta.label, emoji: meta.emoji,
        color: CALENDAR_CATEGORY_META[meta.bucket].color, sourceId: pe.id,
      });
    });
  }
  return events;
}
function sortCalendarEvents(events) {
  return [...events].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    if (!a.startTime && !b.startTime) return 0;
    if (!a.startTime) return -1;
    if (!b.startTime) return 1;
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });
}
// From "now" onward — today's remaining events plus every future one.
function filterUpcomingEvents(events, limit = 5) {
  return sortCalendarEvents(events)
    .filter((e) => {
      if (e.date > TODAY_ISO) return true;
      if (e.date < TODAY_ISO) return false;
      if (!e.startTime) return true;
      return timeToMinutes(e.startTime) >= REFERENCE_NOW_MINUTES;
    })
    .slice(0, limit);
}
// Respects the Week-start preference for this general planner —
// unlike the Schedule page's Week view, which stays Monday–Saturday
// on purpose to match a fixed academic timetable.
function startOfWeekForCalendar(date) {
  const d = new Date(date);
  const day = d.getDay();
  if (livePreferences.weekStart === "sunday") return addDays(d, -day);
  return addDays(d, day === 0 ? -6 : 1 - day);
}
function calendarWeekDayLabels() {
  return livePreferences.weekStart === "sunday"
    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
}
function formatCalendarWeekRange(weekStart) {
  const weekEnd = addDays(weekStart, 6);
  const start = weekStart.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  const end = weekEnd.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  return `${start} – ${end}`;
}

/* ============================================================
   CalendarEventRow.jsx (component) — one reusable row shape used
   by the Day/Week agendas, Today's Timeline, and Upcoming list.
   ============================================================ */
function CalendarEventRow({ event, onClick, showDivider }) {
  return (
    <button
      onClick={() => onClick(event)}
      className="flex items-center gap-3 py-2.5 text-left w-full"
      style={{ borderTop: showDivider ? "1px solid var(--line)" : "none" }}
    >
      <span className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: event.color }} />
      <div className="w-[68px] flex-shrink-0 text-xs font-medium" style={{ color: "var(--slate)" }}>
        {event.startTime ? formatTime12(event.startTime) : "All day"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{event.emoji} {event.title}</p>
        <p className="text-xs truncate" style={{ color: "var(--slate)" }}>{event.subtitle}</p>
      </div>
    </button>
  );
}

/* ============================================================
   CalendarFilters.jsx (component)
   ============================================================ */
function CalendarFilters({ filters, onChange }) {
  const items = [
    { key: "classes", label: "Classes" },
    { key: "assignments", label: "Assignments" },
    { key: "announcements", label: "Announcements" },
    { key: "examEvents", label: "Exams/Events" },
    { key: "reminders", label: "Personal Reminders" },
  ];
  return (
    <div className="flex flex-wrap gap-3 mb-5">
      {items.map((item) => (
        <label key={item.key} className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: "var(--text)" }}>
          <input type="checkbox" checked={filters[item.key]} onChange={(e) => onChange({ ...filters, [item.key]: e.target.checked })} />
          {item.label}
        </label>
      ))}
    </div>
  );
}

/* ============================================================
   CalendarMonthGrid.jsx (component)
   ============================================================ */
function CalendarMonthGrid({ anchorDate, events, selectedDate, onSelectDate }) {
  const weeks = getMonthMatrix(anchorDate);
  const month = anchorDate.getMonth();
  const byDate = {};
  events.forEach((e) => {
    (byDate[e.date] = byDate[e.date] || []).push(e);
  });

  return (
    <div className="cs-card overflow-hidden">
      <div className="grid grid-cols-7" style={{ borderBottom: "1px solid var(--line)" }}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="text-center py-2 text-[11px] font-semibold" style={{ color: "var(--slate)" }}>{d}</div>
        ))}
      </div>
      {weeks.map((row, ri) => (
        <div key={ri} className="grid grid-cols-7">
          {row.map((date) => {
            const iso = toISODate(date);
            const inMonth = date.getMonth() === month;
            const dayEvents = byDate[iso] || [];
            const isSelected = isSameDate(date, selectedDate);
            const isToday = isSameDate(date, REFERENCE_TODAY);
            const categories = [...new Set(dayEvents.map((e) => e.category))].slice(0, 4);
            return (
              <button
                key={iso}
                onClick={() => onSelectDate(date)}
                className="flex flex-col items-start p-2 text-left"
                style={{
                  minHeight: "68px",
                  borderTop: "1px solid var(--line)",
                  borderLeft: "1px solid var(--line)",
                  background: isSelected ? "var(--gold-tint)" : "transparent",
                  opacity: inMonth ? 1 : 0.4,
                }}
              >
                <span className="text-xs font-medium mb-1" style={{ color: isToday ? "var(--gold)" : "var(--text)" }}>{date.getDate()}</span>
                <div className="flex flex-wrap gap-1">
                  {categories.map((cat) => (
                    <span key={cat} className="w-1.5 h-1.5 rounded-full" style={{ background: CALENDAR_CATEGORY_META[cat].color }} />
                  ))}
                  {dayEvents.length > 4 && <span className="text-[9px]" style={{ color: "var(--slate)" }}>+{dayEvents.length - 4}</span>}
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   CalendarWeekAgenda.jsx (component) — simple per-day agenda
   columns, intentionally lighter than the Schedule page's
   hour-grid Week view.
   ============================================================ */
function CalendarWeekAgenda({ weekStart, events, onEventClick }) {
  const labels = calendarWeekDayLabels();
  const byDate = {};
  events.forEach((e) => {
    (byDate[e.date] = byDate[e.date] || []).push(e);
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
      {labels.map((label, i) => {
        const date = addDays(weekStart, i);
        const iso = toISODate(date);
        const dayEvents = sortCalendarEvents(byDate[iso] || []);
        const isToday = isSameDate(date, REFERENCE_TODAY);
        return (
          <div key={iso} className="cs-card p-3" style={isToday ? { borderColor: "var(--gold)" } : {}}>
            <p className="text-xs font-semibold mb-2" style={{ color: isToday ? "var(--gold)" : "var(--ink)" }}>
              {label} · {formatDayNum(date)}
            </p>
            {dayEvents.length === 0 ? (
              <p className="text-[11px]" style={{ color: "var(--slate)" }}>No events</p>
            ) : (
              <div className="flex flex-col">
                {dayEvents.map((e, idx) => (
                  <CalendarEventRow key={e.id} event={e} onClick={onEventClick} showDivider={idx !== 0} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   CalendarDayAgenda.jsx (component)
   ============================================================ */
function CalendarDayAgenda({ date, events, onEventClick, onAddEvent }) {
  const dayEvents = sortCalendarEvents(events.filter((e) => e.date === toISODate(date)));
  return (
    <div className="cs-card p-5 sm:p-6">
      <h2 className="cs-serif text-lg font-semibold mb-1" style={{ color: "var(--ink)" }}>{formatLongDate(date)}</h2>
      <p className="text-xs mb-4" style={{ color: "var(--slate)" }}>{dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}</p>
      {dayEvents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm mb-3" style={{ color: "var(--slate)" }}>Your calendar is clear for this day.</p>
          <button onClick={onAddEvent} className="text-xs font-medium px-3 py-1.5 rounded-md" style={{ background: "var(--gold-tint)", color: "#8A6A1F" }}>
            + Add Event
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          {dayEvents.map((e, idx) => (
            <CalendarEventRow key={e.id} event={e} onClick={onEventClick} showDivider={idx !== 0} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   UpcomingEventsList.jsx (component) — Step 11's "Upcoming"
   section, and reused by the Dashboard's connection card.
   ============================================================ */
function UpcomingEventsList({ events, onEventClick, limit = 5 }) {
  const upcoming = filterUpcomingEvents(events, limit);
  return (
    <div className="cs-card p-5">
      <h2 className="cs-serif text-base font-semibold mb-3" style={{ color: "var(--ink)" }}>Upcoming</h2>
      {upcoming.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--slate)" }}>Nothing else coming up.</p>
      ) : (
        <div className="flex flex-col">
          {upcoming.map((e, idx) => (
            <button key={e.id} onClick={() => onEventClick(e)} className="text-left py-2 w-full" style={{ borderTop: idx !== 0 ? "1px solid var(--line)" : "none" }}>
              <p className="text-[11px] font-medium" style={{ color: "var(--gold)" }}>{describeDate(e.date)}</p>
              <p className="text-sm truncate" style={{ color: "var(--text)" }}>
                {e.emoji} {e.title}{e.startTime ? ` — ${formatTime12(e.startTime)}` : ""}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   TodayTimeline.jsx (component)
   ============================================================ */
function TodayTimeline({ events, onEventClick }) {
  const todays = sortCalendarEvents(events.filter((e) => e.date === TODAY_ISO));
  return (
    <div className="cs-card p-5">
      <h2 className="cs-serif text-base font-semibold mb-3" style={{ color: "var(--ink)" }}>Today's Academic Timeline</h2>
      {todays.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--slate)" }}>No academic events for today.</p>
      ) : (
        <div className="flex flex-col">
          {todays.map((e, idx) => (
            <CalendarEventRow key={e.id} event={e} onClick={onEventClick} showDivider={idx !== 0} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PersonalEventModal.jsx (component) — shared by Add & Edit
   ============================================================ */
function PersonalEventModal({ mode, initialValues, onClose, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const update = (field, val) => setValues((v) => ({ ...v, [field]: val }));

  const handleSubmit = () => {
    if (!values.title || !values.date || !values.startTime || !values.type) {
      setError("Title, date, start time and type are required.");
      return;
    }
    if (values.endTime && values.endTime <= values.startTime) {
      setError("End time must be after start time.");
      return;
    }
    setError("");
    onSubmit(values);
  };

  return (
    <ModalShell title={mode === "add" ? "Add Personal Event" : "Edit Personal Event"} onClose={onClose} wide>
      <div className="flex flex-col gap-3">
        <FormField label="Title">
          <input type="text" placeholder="e.g. DSA Viva" value={values.title} onChange={(e) => update("title", e.target.value)} className="cs-input" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Date">
            <input type="date" value={values.date} onChange={(e) => update("date", e.target.value)} className="cs-input" />
          </FormField>
          <FormField label="Type">
            <select value={values.type} onChange={(e) => update("type", e.target.value)} className="cs-input">
              {Object.entries(PERSONAL_EVENT_TYPE_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Start Time">
            <input type="time" value={values.startTime} onChange={(e) => update("startTime", e.target.value)} className="cs-input" />
          </FormField>
          <FormField label="End Time (optional)">
            <input type="time" value={values.endTime || ""} onChange={(e) => update("endTime", e.target.value || null)} className="cs-input" />
          </FormField>
        </div>
        <FormField label="Subject (optional)">
          <select value={values.subjectId || ""} onChange={(e) => update("subjectId", e.target.value || null)} className="cs-input">
            <option value="">None</option>
            {activeSubjects().map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Description (optional)">
          <textarea rows={2} value={values.description} onChange={(e) => update("description", e.target.value)} className="cs-input" />
        </FormField>

        {error && <p className="text-xs" style={{ color: "var(--warn)" }}>{error}</p>}

        <div className="flex gap-2 mt-2">
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--ink)", color: "#fff" }}>
            {mode === "add" ? "Add Event" : "Save Changes"}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-md text-sm font-medium" style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
            Cancel
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   PersonalEventDetailsModal.jsx (component)
   ============================================================ */
function PersonalEventDetailsModal({ event, onClose, onEdit, onDelete }) {
  const meta = PERSONAL_EVENT_TYPE_META[event.type];
  return (
    <ModalShell title="Personal Event" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <DetailRow label="Title" value={event.title} />
        <DetailRow label="Type" value={`${meta.emoji} ${meta.label}`} />
        <DetailRow label="Date" value={formatLongDate(parseISODate(event.date))} />
        <DetailRow label="Time" value={event.endTime ? `${formatTime12(event.startTime)} – ${formatTime12(event.endTime)}` : formatTime12(event.startTime)} />
        {event.subjectId && <DetailRow label="Subject" value={getSubjectName(event.subjectId)} />}
        <DetailRow label="Description" value={event.description || "—"} />
      </div>
      <div className="flex gap-2 mt-5 pt-4" style={{ borderTop: "1px solid var(--line)" }}>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium"
          style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}
        >
          <Pencil size={13} /> Edit
        </button>
        <button
          onClick={() => onDelete(event.id)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium"
          style={{ background: "var(--warn-tint)", color: "var(--warn)" }}
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   UpcomingAcademicEventsCard.jsx (component) — Dashboard's
   connection to the Calendar. Reuses UpcomingEventsList's data
   logic; the Dashboard's own cards are otherwise untouched.
   ============================================================ */
function UpcomingAcademicEventsCard({ events, onViewCalendar }) {
  const upcoming = filterUpcomingEvents(events, 4);
  return (
    <div className="cs-card p-5 sm:p-6 mb-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="cs-serif text-base font-semibold" style={{ color: "var(--ink)" }}>Upcoming Academic Events</h2>
        <button onClick={onViewCalendar} className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--gold)" }}>
          View Calendar <ArrowUpRight size={12} />
        </button>
      </div>
      {upcoming.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--slate)" }}>Nothing else coming up.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {upcoming.map((e) => (
            <div key={e.id} className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: e.color }} />
              <p className="text-sm truncate" style={{ color: "var(--text)" }}>
                <span style={{ color: "var(--slate)" }}>{describeDate(e.date)} · </span>
                {e.emoji} {e.title}{e.startTime ? ` — ${formatTime12(e.startTime)}` : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   CalendarPage.jsx (component) — owns only its own view/filter/
   modal UI state. Classes, assignments and announcements are
   read live from shared state passed down from App; only
   `personalEvents` is genuinely local-to-this-feature data.
   ============================================================ */
function CalendarPage({ classes, assignments, announcements, personalEvents, setPersonalEvents, onViewClass, onViewAssignment, onViewAnnouncement, pendingOpenPersonalEventId, onPendingOpenHandled, autoOpenAdd, onAutoOpenHandled }) {
  const [view, setView] = useState("Month");
  const [anchorDate, setAnchorDate] = useState(REFERENCE_TODAY);
  const [selectedDate, setSelectedDate] = useState(REFERENCE_TODAY);
  const [filters, setFilters] = useState({ classes: true, assignments: true, announcements: true, examEvents: true, reminders: true });
  const [modal, setModal] = useState(null); // "add" | "edit" | "details" | null
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const events = buildCalendarEvents({ classes, assignments, announcements, personalEvents, filters });

  const handleEventClick = (event) => {
    if (event.category === "class") return onViewClass(event.sourceId);
    if (event.category === "assignment") return onViewAssignment(event.sourceId);
    if (event.category === "announcement") return onViewAnnouncement(event.sourceId);
    setSelectedEventId(event.sourceId);
    setModal("details");
  };

  const closeModal = () => {
    setModal(null);
    setSelectedEventId(null);
  };
  const selectedPersonalEvent = selectedEventId ? personalEvents.find((p) => p.id === selectedEventId) : null;

  // Jumped here from Global Search to view one specific personal
  // event — opens the same details modal this page already has.
  useEffect(() => {
    if (!pendingOpenPersonalEventId) return;
    const pe = personalEvents.find((p) => p.id === pendingOpenPersonalEventId);
    if (pe) {
      setSelectedEventId(pe.id);
      setModal("details");
    }
    onPendingOpenHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingOpenPersonalEventId]);

  // Quick action from the Control Center or Global Search — opens
  // this page's own existing Add Event modal.
  useEffect(() => {
    if (!autoOpenAdd) return;
    setModal("add");
    onAutoOpenHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenAdd]);

  const handleAddSubmit = (values) => {
    setPersonalEvents((prev) => [...prev, { id: `pe-${Date.now()}`, ...values, createdAt: TODAY_ISO }]);
    setModal(null);
    showToast("Event added.");
  };
  const handleEditSubmit = (values) => {
    setPersonalEvents((prev) => prev.map((p) => (p.id === selectedEventId ? { ...p, ...values } : p)));
    setModal(null);
    setSelectedEventId(null);
    showToast("Event updated.");
  };
  const handleDelete = (id) => {
    setPersonalEvents((prev) => prev.filter((p) => p.id !== id));
    closeModal();
    showToast("Event deleted.");
  };

  const weekStart = startOfWeekForCalendar(anchorDate);
  const rangeLabel =
    view === "Month" ? formatMonthYear(anchorDate) : view === "Week" ? formatCalendarWeekRange(weekStart) : formatLongDate(anchorDate);

  const handlePrev = () => {
    if (view === "Month") setAnchorDate(new Date(anchorDate.getFullYear(), anchorDate.getMonth() - 1, 1));
    else if (view === "Week") setAnchorDate(addDays(anchorDate, -7));
    else setAnchorDate(addDays(anchorDate, -1));
  };
  const handleNext = () => {
    if (view === "Month") setAnchorDate(new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 1));
    else if (view === "Week") setAnchorDate(addDays(anchorDate, 7));
    else setAnchorDate(addDays(anchorDate, 1));
  };
  const handleToday = () => {
    setAnchorDate(REFERENCE_TODAY);
    setSelectedDate(REFERENCE_TODAY);
  };

  return (
    <main className="flex-1 px-4 sm:px-8 py-6 max-w-6xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
        <div>
          <h1 className="cs-serif text-[26px] sm:text-[30px] font-semibold" style={{ color: "var(--ink)" }}>Academic Calendar</h1>
          <p className="text-sm mt-1" style={{ color: "var(--slate)" }}>Your classes, deadlines, notices and personal events — all in one place.</p>
        </div>
        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium self-start sm:self-auto"
          style={{ background: "var(--ink)", color: "#fff" }}
        >
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="cs-card p-2" style={{ color: "var(--ink-soft)" }} aria-label="Previous">
            <ChevronLeft size={16} />
          </button>
          <button onClick={handleToday} className="cs-card px-3 py-2 text-xs font-medium" style={{ color: "var(--ink-soft)" }}>
            Today
          </button>
          <button onClick={handleNext} className="cs-card p-2" style={{ color: "var(--ink-soft)" }} aria-label="Next">
            <ChevronRight size={16} />
          </button>
          <span className="text-sm font-medium ml-1" style={{ color: "var(--text)" }}>{rangeLabel}</span>
        </div>
        <div className="cs-card p-1 flex items-center gap-1 self-start">
          {["Day", "Week", "Month"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3 py-1.5 rounded-md text-xs font-medium"
              style={{ background: view === v ? "var(--ink)" : "transparent", color: view === v ? "#fff" : "var(--slate)" }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <CalendarFilters filters={filters} onChange={setFilters} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          {view === "Month" && (
            <>
              <CalendarMonthGrid anchorDate={anchorDate} events={events} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
              <div className="mt-4">
                <CalendarDayAgenda date={selectedDate} events={events} onEventClick={handleEventClick} onAddEvent={() => setModal("add")} />
              </div>
            </>
          )}
          {view === "Week" && <CalendarWeekAgenda weekStart={weekStart} events={events} onEventClick={handleEventClick} />}
          {view === "Day" && (
            <CalendarDayAgenda date={anchorDate} events={events} onEventClick={handleEventClick} onAddEvent={() => setModal("add")} />
          )}
        </div>
        <div className="flex flex-col gap-4">
          <TodayTimeline events={events} onEventClick={handleEventClick} />
          <UpcomingEventsList events={events} onEventClick={handleEventClick} />
        </div>
      </div>

      {modal === "add" && (
        <PersonalEventModal
          mode="add"
          initialValues={{ title: "", date: toISODate(selectedDate), startTime: "09:00", endTime: null, type: "reminder", description: "", subjectId: null }}
          onClose={() => setModal(null)}
          onSubmit={handleAddSubmit}
        />
      )}
      {modal === "edit" && selectedPersonalEvent && (
        <PersonalEventModal mode="edit" initialValues={selectedPersonalEvent} onClose={closeModal} onSubmit={handleEditSubmit} />
      )}
      {modal === "details" && selectedPersonalEvent && (
        <PersonalEventDetailsModal
          event={selectedPersonalEvent}
          onClose={closeModal}
          onEdit={() => setModal("edit")}
          onDelete={handleDelete}
        />
      )}

      <Toast message={toast} />
    </main>
  );
}

/* ================================================================
   ===================  GLOBAL SEARCH  =============================
   ================================================================
   Step 12. Owns no data of its own — buildSearchIndex() reads live
   from the exact same shared state every other page already reads
   (classes, subjects, assignments, resources, announcements,
   personal calendar events), so search always reflects the current
   state: edit an assignment and it's immediately searchable under
   its new title; delete a resource and it disappears from results.

   Clicking a result reuses the SAME navigation pattern used
   throughout the app (the pendingOpen*Id hooks already built for
   Schedule/Assignments/Notes/Announcements/Calendar) — there is no
   second details system for any category.

   Calendar events sourced from a class/assignment/announcement are
   deliberately NOT re-indexed as a separate "Events" entry — that
   would show the same real record twice under two categories. Only
   genuinely personal calendar events (exams, vivas, study sessions,
   reminders — the ones with no other home) get their own "Events"
   entries.
   ================================================================ */

const SEARCH_CATEGORY_META = {
  classes: "Classes",
  subjects: "Subjects",
  assignments: "Assignments",
  resources: "Resources",
  announcements: "Announcements",
  events: "Events",
};
const SEARCH_CATEGORY_ORDER = ["classes", "subjects", "assignments", "resources", "announcements", "events"];

/* ------------------------------------------------------------
   The indexing layer — a flat, read-only view over live state.
   ------------------------------------------------------------ */
function buildSearchIndex({ classes, subjects, assignments, resources, announcements, calendarEvents }) {
  const items = [];

  subjects.forEach((s) => {
    items.push({
      id: `search-subject-${s.id}`,
      category: "subjects",
      title: s.name,
      subtitle: [s.facultyName, s.code].filter(Boolean).join(" · "),
      searchText: [s.name, s.code, s.facultyName, s.facultyEmail, s.room].filter(Boolean).join(" ").toLowerCase(),
      sourceType: "subject",
      sourceId: s.id,
    });
  });

  classes.forEach((c) => {
    const r = resolveClass(c);
    items.push({
      id: `search-class-${c.id}`,
      category: "classes",
      title: r.subject,
      subtitle: `${r.faculty} · ${r.room} · ${formatDayNum(parseISODate(r.date))}`,
      searchText: [r.subject, r.faculty, r.room, r.date, STATUS_META[r.status].label].filter(Boolean).join(" ").toLowerCase(),
      sourceType: "class",
      sourceId: c.id,
    });
  });

  assignments.forEach((a) => {
    items.push({
      id: `search-assignment-${a.id}`,
      category: "assignments",
      title: a.title,
      subtitle: `Assignment · Due: ${formatDeadlineLabel(a)}`,
      searchText: [a.title, getSubjectName(a.subjectId), a.description, ASSIGNMENT_TYPE_META[a.type]].filter(Boolean).join(" ").toLowerCase(),
      sourceType: "assignment",
      sourceId: a.id,
    });
  });

  resources.forEach((r) => {
    const meta = RESOURCE_TYPE_META[r.type];
    items.push({
      id: `search-resource-${r.id}`,
      category: "resources",
      title: r.name,
      subtitle: `${meta.label} · ${getSubjectName(r.subjectId)}`,
      searchText: [r.name, getSubjectName(r.subjectId), meta.label, r.description, r.uploaderName].filter(Boolean).join(" ").toLowerCase(),
      sourceType: "resource",
      sourceId: r.id,
    });
  });

  announcements.forEach((an) => {
    const typeMeta = ANNOUNCEMENT_TYPE_META[an.type];
    items.push({
      id: `search-announcement-${an.id}`,
      category: "announcements",
      title: an.title,
      subtitle: `${typeMeta.label} · ${an.author}`,
      searchText: [an.title, an.message, typeMeta.label, an.author].filter(Boolean).join(" ").toLowerCase(),
      sourceType: "announcement",
      sourceId: an.id,
    });
  });

  calendarEvents
    .filter((e) => e.category === "exam_event" || e.category === "reminder")
    .forEach((e) => {
      items.push({
        id: `search-event-${e.sourceId}`,
        category: "events",
        title: e.title,
        subtitle: `${CALENDAR_CATEGORY_META[e.category].label} · ${formatDayNum(parseISODate(e.date))}`,
        searchText: [e.title, e.subtitle, CALENDAR_CATEGORY_META[e.category].label].filter(Boolean).join(" ").toLowerCase(),
        sourceType: "personal_event",
        sourceId: e.sourceId,
      });
    });

  return items;
}
function matchSearchIndex(items, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return items.filter((item) => item.searchText.includes(q));
}
function groupSearchResults(results) {
  const byCategory = {};
  SEARCH_CATEGORY_ORDER.forEach((k) => (byCategory[k] = []));
  results.forEach((r) => byCategory[r.category]?.push(r));
  return SEARCH_CATEGORY_ORDER.map((key) => ({ key, label: SEARCH_CATEGORY_META[key], items: byCategory[key] })).filter((g) => g.items.length > 0);
}

/* ============================================================
   SearchFilters.jsx (component)
   ============================================================ */
function SearchResultFilters({ filter, onChange }) {
  const options = [{ key: "all", label: "All" }, ...SEARCH_CATEGORY_ORDER.map((k) => ({ key: k, label: SEARCH_CATEGORY_META[k] }))];
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className="px-3 py-1.5 rounded-md text-xs font-medium"
          style={{
            background: filter === opt.key ? "var(--ink)" : "var(--paper)",
            color: filter === opt.key ? "#fff" : "var(--ink-soft)",
            border: "1px solid var(--line)",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ============================================================
   GlobalSearchModal.jsx (component)
   ============================================================ */
function GlobalSearchModal({ searchIndex, onClose, onResultClick, onQuickAction, recentSearches, onAddRecentSearch, onClearRecentSearches }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = matchSearchIndex(searchIndex, query);
  const filtered = filter === "all" ? results : results.filter((r) => r.category === filter);
  const grouped = groupSearchResults(filtered);

  const handleResultClick = (item) => {
    if (query.trim()) onAddRecentSearch(query.trim());
    onResultClick(item);
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-start justify-center pt-16 sm:pt-24 p-4"
      style={{ background: "rgba(15,20,32,0.6)" }}
      onClick={onClose}
    >
      <div
        className="cs-card w-full max-w-2xl max-h-[75vh] overflow-y-auto cs-scroll"
        style={{ background: "var(--panel)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--line)" }}>
          <Search size={16} style={{ color: "var(--slate)" }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) onAddRecentSearch(query.trim());
              if (e.key === "Escape") onClose();
            }}
            placeholder="Search classes, subjects, assignments, resources…"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--text)" }}
          />
          <button onClick={onClose} style={{ color: "var(--slate)" }} aria-label="Close search">
            <X size={16} />
          </button>
        </div>

        <div className="p-4">
          {query.trim() === "" ? (
            <>
              {recentSearches.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--slate)" }}>Recent Searches</p>
                    <button onClick={onClearRecentSearches} className="text-xs font-medium" style={{ color: "var(--warn)" }}>Clear</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuery(q)}
                        className="px-3 py-1.5 rounded-full text-xs"
                        style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-soft)" }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: "var(--slate)" }}>
                  <Zap size={12} /> Quick Actions
                </p>
                <QuickActions
                  onAction={(key) => {
                    onQuickAction(key);
                    onClose();
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <SearchResultFilters filter={filter} onChange={setFilter} />
              {filtered.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>No results found</p>
                  <p className="text-xs" style={{ color: "var(--slate)" }}>Try searching by subject, assignment, faculty, or resource name.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {grouped.map((group) => (
                    <div key={group.key}>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--slate)" }}>{group.label}</p>
                      <div className="flex flex-col">
                        {group.items.map((item, idx) => (
                          <button
                            key={item.id}
                            onClick={() => handleResultClick(item)}
                            className="flex flex-col text-left py-2.5"
                            style={{ borderTop: idx !== 0 ? "1px solid var(--line)" : "none" }}
                          >
                            <span className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{item.title}</span>
                            <span className="text-xs truncate" style={{ color: "var(--slate)" }}>{item.subtitle}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   App.jsx (root component)
   ============================================================ */
export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  // Single shared source of truth for the timetable — both the
  // Dashboard and the Schedule page read/write this same state.
  const [classes, setClasses] = useState(scheduleDemoData);

  // Single shared source of truth for notifications too — the
  // Schedule page's actions call addNotification(), the header
  // bell and the Dashboard's Important Updates both just read
  // this same list, so nothing can drift out of sync.
  const [notifications, setNotifications] = useState(initialNotifications);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);

  // Lets a reminder toast's "View Class" button jump into the
  // Schedule page and open that class's details.
  const [pendingOpenClassId, setPendingOpenClassId] = useState(null);

  // Demo "upcoming class" reminder toast.
  const [reminderToastClassId, setReminderToastClassId] = useState(null);
  const [dismissedReminderIds, setDismissedReminderIds] = useState(() => new Set());

  // Single shared source of truth for Notes & Resources — the
  // Schedule page's Class Details modal reads this for its
  // preview, and "View All Resources →" jumps into the Notes
  // page pre-filtered to that class's subject.
  const [resources, setResources] = useState(resourcesDemoData);
  const [pendingNotesSubjectId, setPendingNotesSubjectId] = useState(null);
  const handleViewResources = (subjectId) => {
    setActive("Notes");
    setPendingNotesSubjectId(subjectId);
  };

  // Single shared source of truth for Assignments — both the
  // Assignments page and the Dashboard's existing Upcoming
  // Assignments card read this same state (via
  // deriveDashboardAssignments below), so completing or adding
  // an assignment shows up in both places automatically.
  const [assignments, setAssignments] = useState(assignmentsDemoData);
  const [notifiedDueSoonIds, setNotifiedDueSoonIds] = useState(() => new Set());
  const [notifiedCalendarEventIds, setNotifiedCalendarEventIds] = useState(() => new Set());

  // Single shared source of truth for Attendance — both the
  // Attendance page and the Dashboard's existing
  // AttendanceOverviewCard read this same state (via
  // deriveDashboardAttendance below).
  const [attendanceRecords, setAttendanceRecords] = useState(attendanceRecordsDemoData);

  // Single shared source of truth for Announcements — the
  // Announcements page, the Dashboard's Recent Announcements card,
  // and the Notification Center all read this same list.
  const [announcements, setAnnouncements] = useState(announcementsDemoData);

  // "View Class" from an announcement reuses the exact same
  // pendingOpenClassId hook the reminder toast already uses.
  const handleViewClassFromAnnouncement = (classId) => {
    setActive("Schedule");
    setPendingOpenClassId(classId);
  };

  // Personal academic events — the ONE dataset the Calendar owns.
  // Classes/assignments/announcements are read live from the state
  // already declared above; nothing about them is duplicated here.
  const [academicEvents, setAcademicEvents] = useState(academicEventsDemoData);

  // Same "navigate + open the owning page's own details modal"
  // pattern as handleViewClassFromAnnouncement, extended to
  // assignments and announcements so the Calendar can reuse all
  // three existing details systems without building a fourth.
  const [pendingOpenAssignmentId, setPendingOpenAssignmentId] = useState(null);
  const [pendingOpenAnnouncementId, setPendingOpenAnnouncementId] = useState(null);
  const handleViewAssignmentFromCalendar = (assignmentId) => {
    setActive("Assignments");
    setPendingOpenAssignmentId(assignmentId);
  };
  const handleViewAnnouncementFromCalendar = (announcementId) => {
    setActive("Announcements");
    setPendingOpenAnnouncementId(announcementId);
  };
  const handleViewCalendar = () => setActive("Calendar");

  /* ---- Step 8: centralized personal / academic / subject state ----
     `subjects` and `preferences` also write to the module-level
     `liveSubjects` / `livePreferences` mirrors, which is what lets
     getSubjectName(), getFacultyName() and formatTime12() — called
     from deep inside pages that never receive these as props —
     stay correct. The wrapper setters below are the ONLY place
     those mirrors are written. */
  const [profile, setProfile] = useState(initialProfile);
  const [subjects, setSubjectsState] = useState(initialSubjects);
  const [preferences, setPreferencesState] = useState(initialPreferences);

  const setSubjects = (updater) => {
    setSubjectsState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      liveSubjects = next;
      return next;
    });
  };
  const setPreferences = (updater) => {
    setPreferencesState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      livePreferences = next;
      return next;
    });
  };

  // Optional first-time setup. Shown once per page load at most, and
  // only when there's no profile name yet — never forced on reload
  // for this demo, since the demo profile is pre-filled.
  const [showOnboarding, setShowOnboarding] = useState(() => !initialProfile.name);

  const handleResetDemoData = () => {
    setProfile(initialProfile);
    setSubjects(initialSubjects);
    setPreferences(initialPreferences);
    setClasses(scheduleDemoData);
    setNotifications(initialNotifications);
    setResources(resourcesDemoData);
    setAssignments(assignmentsDemoData);
    setAttendanceRecords(attendanceRecordsDemoData);
    setAnnouncements(announcementsDemoData);
    setAcademicEvents(academicEventsDemoData);
    setNotifiedDueSoonIds(new Set());
    setDismissedReminderIds(new Set());
    setNotifiedCalendarEventIds(new Set());
  };

  const openProfile = () => {
    setActive("Settings");
    setPendingSettingsTab("Profile");
  };

  // Quick actions from the Control Center: navigate to the owning
  // page and flag it to open its own existing add modal. No forms
  // are duplicated — each page opens the one it already has.
  const [quickActionPage, setQuickActionPage] = useState(null);
  const [controlCenterSubjectHint, setControlCenterSubjectHint] = useState(0);
  const handleQuickAction = (key) => {
    const routes = {
      class: "Schedule",
      assignment: "Assignments",
      resource: "Notes",
      attendance: "Attendance",
      announcement: "Announcements",
      event: "Calendar",
    };
    if (key === "subject") {
      // Subject management lives on the Control Center — navigate
      // there and nudge it to the Subjects section, regardless of
      // which page the action was triggered from.
      setActive("Control Center");
      setControlCenterSubjectHint((n) => n + 1);
      return;
    }
    setActive(routes[key]);
    setQuickActionPage(routes[key]);
  };
  const clearQuickAction = () => setQuickActionPage(null);

  // Global Search (Step 12) — owns no data; buildSearchIndex reads
  // live from the same state everything else here already uses.
  const [searchOpen, setSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [pendingSettingsTab, setPendingSettingsTab] = useState("Profile");
  const [pendingOpenResourceId, setPendingOpenResourceId] = useState(null);
  const [pendingOpenPersonalEventId, setPendingOpenPersonalEventId] = useState(null);

  const addRecentSearch = (q) => {
    setRecentSearches((prev) => [q, ...prev.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 5));
  };
  const clearRecentSearches = () => setRecentSearches([]);

  const handleSearchResultClick = (item) => {
    setSearchOpen(false);
    switch (item.sourceType) {
      case "class":
        setActive("Schedule");
        setPendingOpenClassId(item.sourceId);
        break;
      case "assignment":
        setActive("Assignments");
        setPendingOpenAssignmentId(item.sourceId);
        break;
      case "resource":
        setActive("Notes");
        setPendingOpenResourceId(item.sourceId);
        break;
      case "announcement":
        setActive("Announcements");
        setPendingOpenAnnouncementId(item.sourceId);
        break;
      case "personal_event":
        setActive("Calendar");
        setPendingOpenPersonalEventId(item.sourceId);
        break;
      case "subject":
        setActive("Settings");
        setPendingSettingsTab("Subjects");
        break;
      default:
        break;
    }
  };

  // Cmd+K (Mac) / Ctrl+K (Windows/Linux) opens search from anywhere.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  // Clears personal/academic setup but keeps the academic records,
  // so a student can re-enter their details without losing history.
  const handleResetAcademicSetup = () => {
    setProfile({ name: "", email: "", phone: "", photoUrl: null, college: "", program: "", department: "", academicSession: "", year: "", semester: "", section: "", roll: "" });
    setSubjects([]);
    setShowOnboarding(true);
  };

  // Empties everything — a blank ClassSync on this device.
  const handleClearLocalData = () => {
    handleResetAcademicSetup();
    setPreferences(initialPreferences);
    setClasses([]);
    setNotifications([]);
    setResources([]);
    setAssignments([]);
    setAttendanceRecords([]);
    setAnnouncements([]);
    setAcademicEvents([]);
    setNotifiedDueSoonIds(new Set());
    setDismissedReminderIds(new Set());
    setNotifiedCalendarEventIds(new Set());
  };

  const todayISO = toISODate(REFERENCE_TODAY);
  const todaysRawClasses = classes.filter((c) => c.date === todayISO).map(resolveClass);
  const dashboardSchedule = deriveDashboardSchedule(todaysRawClasses);
  const dashboardNextClass = dashboardSchedule.find((c) => c.status === "next");
  const dashboardAssignments = deriveDashboardAssignments(assignments);
  const dashboardAttendance = deriveDashboardAttendance(attendanceRecords);
  const dashboardAnnouncements = deriveDashboardAnnouncements(announcements);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (notif) => {
    setNotifications((prev) => [
      { id: `n-${Date.now()}`, date: todayISO, time: formatClockTime(REFERENCE_NOW_MINUTES), read: false, ...notif },
      ...prev,
    ]);
  };
  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Check once whether any of today's classes has a reminder
  // whose window has opened, so the toast shows up automatically
  // without the person needing to do anything first.
  useEffect(() => {
    const due = findDueReminder(classes, dismissedReminderIds);
    setReminderToastClassId(due ? due.id : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classes]);

  const dismissReminderToast = () => {
    setDismissedReminderIds((prev) => new Set(prev).add(reminderToastClassId));
    setReminderToastClassId(null);
  };
  const viewReminderClass = () => {
    setDismissedReminderIds((prev) => new Set(prev).add(reminderToastClassId));
    setActive("Schedule");
    setPendingOpenClassId(reminderToastClassId);
    setReminderToastClassId(null);
  };

  const reminderToastClass = reminderToastClassId
    ? resolveClass(classes.find((c) => c.id === reminderToastClassId))
    : null;

  // Demo "assignment due soon" check — same one-time-per-item
  // pattern as the class reminder above, just keyed off deadlines
  // instead of an explicit reminder setting.
  useEffect(() => {
    assignments.forEach((a) => {
      if (notifiedDueSoonIds.has(a.id)) return;
      if (getDisplayStatus(a) === "completed" || getDisplayStatus(a) === "submitted") return;
      if (computeUrgency(a) === "due_today") {
        addNotification({
          type: "assignment",
          title: "Assignment Due Soon",
          message: `${a.title} is due today.`,
          relatedClassId: a.relatedClassId || null,
        });
        setNotifiedDueSoonIds((prev) => new Set(prev).add(a.id));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignments]);

  // Notification connection for the Academic Calendar: today's
  // personal events and calendar-eligible announcements each get
  // surfaced once, through the same existing notification system.
  useEffect(() => {
    academicEvents
      .filter((e) => e.date === TODAY_ISO)
      .forEach((e) => {
        const notifKey = `pe-${e.id}`;
        if (notifiedCalendarEventIds.has(notifKey)) return;
        addNotification({
          type: "calendar_event",
          title: "Academic Event Today",
          message: `${e.title}${e.startTime ? ` — ${formatTime12(e.startTime)}` : ""}.`,
          relatedClassId: null,
        });
        setNotifiedCalendarEventIds((prev) => new Set(prev).add(notifKey));
      });
    announcements
      .filter((an) => an.eventDate === TODAY_ISO && CALENDAR_ELIGIBLE_ANNOUNCEMENT_TYPES.includes(an.type))
      .forEach((an) => {
        const notifKey = `an-${an.id}`;
        if (notifiedCalendarEventIds.has(notifKey)) return;
        addNotification({
          type: "calendar_event",
          title: "Academic Event Today",
          message: an.title,
          relatedClassId: an.classId || null,
        });
        setNotifiedCalendarEventIds((prev) => new Set(prev).add(notifKey));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [academicEvents, announcements]);

  // Feeds both the Calendar page's own "Upcoming" list logic and
  // the Dashboard's connection card — same buildCalendarEvents()
  // transformation, computed once here so neither duplicates it.
  const dashboardCalendarEvents = buildCalendarEvents({
    classes,
    assignments,
    announcements,
    personalEvents: academicEvents,
    filters: { classes: true, assignments: true, announcements: true, examEvents: true, reminders: true },
  });

  const searchIndex = buildSearchIndex({
    classes,
    subjects,
    assignments,
    resources,
    announcements,
    calendarEvents: dashboardCalendarEvents,
  });

  return (
    <div className="cs-root flex min-h-screen w-full">
      <Tokens />
      <Sidebar
        active={active}
        profile={profile}
        onOpenProfile={openProfile}
        onSelect={(item) => {
          setActive(item);
          setMobileOpen(false);
        }}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setMobileOpen(true)}
          profile={profile}
          unreadCount={unreadCount}
          onBellClick={() => setNotifPanelOpen((o) => !o)}
          onOpenProfile={openProfile}
          onOpenSearch={() => setSearchOpen(true)}
        />
        {active === "Dashboard" && (
          <Dashboard
            profile={profile}
            schedule={dashboardSchedule}
            nextClass={dashboardNextClass}
            assignments={dashboardAssignments}
            announcements={dashboardAnnouncements}
            attendance={dashboardAttendance}
            notifications={notifications}
            calendarEvents={dashboardCalendarEvents}
            onViewCalendar={handleViewCalendar}
            onQuickAction={handleQuickAction}
          />
        )}
        {active === "Schedule" && (
          <SchedulePage
            classes={classes}
            setClasses={setClasses}
            onNotify={addNotification}
            pendingOpenClassId={pendingOpenClassId}
            onPendingOpenHandled={() => setPendingOpenClassId(null)}
            resources={resources}
            onViewResources={handleViewResources}
            defaultView={preferences.defaultCalendarView}
            autoOpenAdd={quickActionPage === "Schedule"}
            onAutoOpenHandled={clearQuickAction}
          />
        )}
        {active === "Notes" && (
          <NotesPage
            resources={resources}
            setResources={setResources}
            pendingSubjectId={pendingNotesSubjectId}
            onPendingHandled={() => setPendingNotesSubjectId(null)}
            autoOpenAdd={quickActionPage === "Notes"}
            onAutoOpenHandled={clearQuickAction}
            pendingOpenResourceId={pendingOpenResourceId}
            onPendingOpenResourceHandled={() => setPendingOpenResourceId(null)}
          />
        )}
        {active === "Assignments" && (
          <AssignmentsPage
            assignments={assignments}
            setAssignments={setAssignments}
            onNotify={addNotification}
            resources={resources}
            onViewResources={handleViewResources}
            autoOpenAdd={quickActionPage === "Assignments"}
            onAutoOpenHandled={clearQuickAction}
            pendingOpenAssignmentId={pendingOpenAssignmentId}
            onPendingOpenHandled={() => setPendingOpenAssignmentId(null)}
          />
        )}
        {active === "Attendance" && (
          <AttendancePage
            records={attendanceRecords}
            setRecords={setAttendanceRecords}
            autoOpenAdd={quickActionPage === "Attendance"}
            onAutoOpenHandled={clearQuickAction}
          />
        )}
        {active === "Announcements" && (
          <AnnouncementsPage
            announcements={announcements}
            setAnnouncements={setAnnouncements}
            classes={classes}
            onNotify={addNotification}
            onViewClass={handleViewClassFromAnnouncement}
            autoOpenAdd={quickActionPage === "Announcements"}
            onAutoOpenHandled={clearQuickAction}
            pendingOpenAnnouncementId={pendingOpenAnnouncementId}
            onPendingOpenHandled={() => setPendingOpenAnnouncementId(null)}
          />
        )}
        {active === "Calendar" && (
          <CalendarPage
            classes={classes}
            assignments={assignments}
            announcements={announcements}
            personalEvents={academicEvents}
            setPersonalEvents={setAcademicEvents}
            onViewClass={(classId) => {
              setActive("Schedule");
              setPendingOpenClassId(classId);
            }}
            onViewAssignment={handleViewAssignmentFromCalendar}
            onViewAnnouncement={handleViewAnnouncementFromCalendar}
            pendingOpenPersonalEventId={pendingOpenPersonalEventId}
            onPendingOpenHandled={() => setPendingOpenPersonalEventId(null)}
            autoOpenAdd={quickActionPage === "Calendar"}
            onAutoOpenHandled={clearQuickAction}
          />
        )}
        {active === "Control Center" && (
          <ControlCenterPage
            profile={profile}
            setProfile={setProfile}
            subjects={subjects}
            setSubjects={setSubjects}
            preferences={preferences}
            setPreferences={setPreferences}
            classes={classes}
            assignments={assignments}
            attendanceRecords={attendanceRecords}
            onQuickAction={handleQuickAction}
            onResetDemoData={handleResetDemoData}
            onResetAcademicSetup={handleResetAcademicSetup}
            onClearLocalData={handleClearLocalData}
            subjectHint={controlCenterSubjectHint}
          />
        )}
        {active === "Settings" && (
          <SettingsPage
            profile={profile}
            setProfile={setProfile}
            subjects={subjects}
            setSubjects={setSubjects}
            preferences={preferences}
            setPreferences={setPreferences}
            onResetDemoData={handleResetDemoData}
            onRunOnboarding={() => setShowOnboarding(true)}
            initialTab={pendingSettingsTab}
          />
        )}
        {!["Dashboard", "Schedule", "Notes", "Assignments", "Attendance", "Announcements", "Calendar", "Control Center", "Settings"].includes(active) && <ComingSoonPage label={active} />}
        {/* Reserves space so MobileBottomNav (fixed) never covers the last bit of content. */}
        <div className="h-16 lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }} />
      </div>

      <MobileBottomNav
        active={active}
        onSelect={setActive}
        onMore={() => setMobileOpen(true)}
      />

      {notifPanelOpen && (
        <NotificationCenter
          notifications={notifications}
          onMarkRead={markNotificationRead}
          onMarkAllRead={markAllNotificationsRead}
          onClose={() => setNotifPanelOpen(false)}
        />
      )}

      {showOnboarding && (
        <Onboarding
          initialProfileValues={profile}
          onComplete={(draft) => {
            setProfile(draft);
            setShowOnboarding(false);
            setActive("Dashboard");
          }}
          onSkip={() => setShowOnboarding(false)}
        />
      )}

      {searchOpen && (
        <GlobalSearchModal
          searchIndex={searchIndex}
          onClose={() => setSearchOpen(false)}
          onResultClick={handleSearchResultClick}
          onQuickAction={handleQuickAction}
          recentSearches={recentSearches}
          onAddRecentSearch={addRecentSearch}
          onClearRecentSearches={clearRecentSearches}
        />
      )}

      <ReminderToast cls={reminderToastClass} onView={viewReminderClass} onDismiss={dismissReminderToast} />
    </div>
  );
}
