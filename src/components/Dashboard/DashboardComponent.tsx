import type { InterviewTs } from "../../types/interview/interview";
import "./DashboardComponent.css";

export type DashboardStats = {
  total: number;
  hrScreening: number;
  technical: number;
  final: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  updatedCount: number;
};

export type DashboardData = {
  stats: DashboardStats;
  todaysInterview: InterviewTs[];
  upComingInterviews: InterviewTs[];
  recentInterviews: InterviewTs[];
  nextInterview: InterviewTs | null;
  completionRate: number;
  cancellationRate: number;
  hrScreeningRate: number;
  technicalRate: number;
  finalRate: number;
  activityLength: number;
};

function getInterviewDateTime(interview: InterviewTs): Date {
  return new Date(`${interview.date}T${interview.startTime}`);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDashboardStats(interviews: InterviewTs[]): DashboardStats {
  return interviews.reduce(
    (acc, current) => {
      acc.total++;

      if (current.type === "hr-screening") acc.hrScreening++;
      if (current.type === "technical") acc.technical++;
      if (current.type === "final") acc.final++;

      if (current.status === "cancelled") acc.cancelled++;
      if (current.status === "completed") acc.completed++;
      if (current.status === "scheduled") acc.scheduled++;

      if (current.updatedAt !== null) acc.updatedCount++;

      return acc;
    },
    {
      total: 0,
      hrScreening: 0,
      technical: 0,
      final: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0,
      updatedCount: 0,
    },
  );
}

function getTodaysInterview(interviews: InterviewTs[]): InterviewTs[] {
  const now = new Date();

  return interviews
    .filter((i) => {
      const interviewDate = getInterviewDateTime(i);
      return isSameDay(interviewDate, now) && i.status === "scheduled";
    })
    .sort(
      (a, b) =>
        getInterviewDateTime(a).getTime() - getInterviewDateTime(b).getTime(),
    );
}

function getUpComingInterviews(interviews: InterviewTs[]): InterviewTs[] {
  const now = new Date();

  return interviews
    .filter(
      (i) =>
        i.status === "scheduled" &&
        getInterviewDateTime(i).getTime() >= now.getTime(),
    )
    .sort(
      (a, b) =>
        getInterviewDateTime(a).getTime() - getInterviewDateTime(b).getTime(),
    );
}

function getRecentInterviews(
  interviews: InterviewTs[],
  limit = 5,
): InterviewTs[] {
  return [...interviews]
    .sort((a, b) => {
      const aTime = a.updatedAt ?? a.createdAt;
      const bTime = b.updatedAt ?? b.createdAt;
      return bTime - aTime;
    })
    .slice(0, limit);
}

function getNextInterview(interviews: InterviewTs[]): InterviewTs | null {
  const now = new Date();

  return (
    interviews
      .filter(
        (i) =>
          i.status === "scheduled" &&
          getInterviewDateTime(i).getTime() >= now.getTime(),
      )
      .sort(
        (a, b) =>
          getInterviewDateTime(a).getTime() - getInterviewDateTime(b).getTime(),
      )[0] ?? null
  );
}

function getActivitiesLength(interviews: InterviewTs[]): number {
  return interviews.reduce((acc, curr) => {
    return acc + (curr.activities ?? []).length;
  }, 0);
}

type DashboardComponentProps = {
  interviews: InterviewTs[];
};

 function getDashboardData(interviews: InterviewTs[]): DashboardData {
  const stats = getDashboardStats(interviews);
  const todaysInterview = getTodaysInterview(interviews);
  const upComingInterviews = getUpComingInterviews(interviews);
  const recentInterviews = getRecentInterviews(interviews, 5);
  const nextInterview = getNextInterview(interviews);
  const activityLength = getActivitiesLength(interviews);

  return {
    stats,
    todaysInterview,
    upComingInterviews,
    recentInterviews,
    nextInterview,
    completionRate: stats.total
      ? Math.round((stats.completed / stats.total) * 100)
      : 0,
    cancellationRate: stats.total
      ? Math.round((stats.cancelled / stats.total) * 100)
      : 0,
    hrScreeningRate: stats.total
      ? Math.round((stats.hrScreening / stats.total) * 100)
      : 0,
    technicalRate: stats.total
      ? Math.round((stats.technical / stats.total) * 100)
      : 0,
    finalRate: stats.total ? Math.round((stats.final / stats.total) * 100) : 0,
    activityLength,
  };
}

function formatInterviewType(type: InterviewTs["type"]) {
  switch (type) {
    case "hr-screening":
      return "HR Screening";
    case "technical":
      return "Technical";
    case "final":
      return "Final";
    default:
      return type;
  }
}

function formatStatus(status: InterviewTs["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(time: string) {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatTimestamp(timestamp: number | null | undefined) {
  if (!timestamp) return "—";

  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusClass(status: InterviewTs["status"]) {
  switch (status) {
    case "scheduled":
      return "badge badge--scheduled";
    case "completed":
      return "badge badge--completed";
    case "cancelled":
      return "badge badge--cancelled";
    default:
      return "badge";
  }
}

function getTypeClass(type: InterviewTs["type"]) {
  switch (type) {
    case "hr-screening":
      return "badge badge--hr";
    case "technical":
      return "badge badge--technical";
    case "final":
      return "badge badge--final";
    default:
      return "badge";
  }
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="progress-block">
      <div className="progress-header">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  subLabel,
}: {
  label: string;
  value: number;
  subLabel?: string;
}) {
  return (
    <div className="stat-card">
      <p className="stat-card__label">{label}</p>
      <h3 className="stat-card__value">{value}</h3>
      {subLabel ? <p className="stat-card__sub">{subLabel}</p> : null}
    </div>
  );
}

function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="section-card">
      <div className="section-card__header">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function InterviewRow({ interview }: { interview: InterviewTs }) {
  const lastUpdated = interview.updatedAt ?? interview.createdAt;

  return (
    <div className="interview-row">
      <div className="interview-row__content">
        <div className="interview-row__badges">
          <span className={getTypeClass(interview.type)}>
            {formatInterviewType(interview.type)}
          </span>
          <span className={getStatusClass(interview.status)}>
            {formatStatus(interview.status)}
          </span>
        </div>

        <div className="interview-row__meta">
          <span>{formatDate(interview.date)}</span>
          <span>{formatTime(interview.startTime)}</span>
          <span>{(interview.activities ?? []).length} activities</span>
        </div>

        <p className="interview-row__updated">
          Updated: {formatTimestamp(lastUpdated)}
        </p>
      </div>
    </div>
  );
}

export default function DashboardComponent({
  interviews,
}: DashboardComponentProps) {
  const {
    stats,
    todaysInterview,
    upComingInterviews,
    recentInterviews,
    nextInterview,
    completionRate,
    cancellationRate,
    hrScreeningRate,
    technicalRate,
    finalRate,
    activityLength,
  } = getDashboardData(interviews);

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <div className="dashboard__topbar">
          <div>
            <h1 className="dashboard__title">Interview Dashboard</h1>
            <p className="dashboard__subtitle">
              Track interview pipeline, schedule, and recent changes.
            </p>
          </div>

          <div className="dashboard__activity-box">
            <span>Total activity logs:</span>
            <strong>{activityLength}</strong>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard label="Total Interviews" value={stats.total} />
          <StatCard label="Scheduled" value={stats.scheduled} />
          <StatCard
            label="Completed"
            value={stats.completed}
            subLabel={`${completionRate}% completion rate`}
          />
          <StatCard
            label="Cancelled"
            value={stats.cancelled}
            subLabel={`${cancellationRate}% cancellation rate`}
          />
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-main">
            <SectionCard title="Next Interview">
              {nextInterview ? (
                <div className="next-interview-card">
                  <div className="interview-row__badges">
                    <span className={getTypeClass(nextInterview.type)}>
                      {formatInterviewType(nextInterview.type)}
                    </span>
                    <span className={getStatusClass(nextInterview.status)}>
                      {formatStatus(nextInterview.status)}
                    </span>
                  </div>

                  <div className="next-interview-card__grid">
                    <div>
                      <p className="label-muted">Date</p>
                      <p>{formatDate(nextInterview.date)}</p>
                    </div>
                    <div>
                      <p className="label-muted">Start Time</p>
                      <p>{formatTime(nextInterview.startTime)}</p>
                    </div>
                    <div>
                      <p className="label-muted">Activities</p>
                      <p>{(nextInterview.activities ?? []).length}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  No upcoming scheduled interviews.
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Upcoming Interviews"
              action={
                <span className="section-action">
                  {upComingInterviews.length} total
                </span>
              }
            >
              <div className="list-block">
                {upComingInterviews.length > 0 ? (
                  upComingInterviews
                    .slice(0, 6)
                    .map((interview, index) => (
                      <InterviewRow
                        key={`${interview.date}-${interview.startTime}-${index}`}
                        interview={interview}
                      />
                    ))
                ) : (
                  <div className="empty-state">
                    No upcoming interviews scheduled.
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Recent Interviews">
              <div className="list-block">
                {recentInterviews.length > 0 ? (
                  recentInterviews.map((interview, index) => (
                    <InterviewRow
                      key={`${interview.date}-${interview.startTime}-recent-${index}`}
                      interview={interview}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    No recent interview updates.
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          <div className="dashboard-side">
            <SectionCard title="Today">
              <div className="list-block">
                {todaysInterview.length > 0 ? (
                  todaysInterview.map((interview, index) => (
                    <InterviewRow
                      key={`${interview.date}-${interview.startTime}-today-${index}`}
                      interview={interview}
                    />
                  ))
                ) : (
                  <div className="empty-state">No interviews for today.</div>
                )}
              </div>
            </SectionCard>

           
    
            

            <SectionCard title="Pipeline Breakdown">
              <div className="progress-list">
                <ProgressBar label="HR Screening" value={hrScreeningRate} />
                <ProgressBar label="Technical" value={technicalRate} />
                <ProgressBar label="Final" value={finalRate} />
                <ProgressBar label="Completion" value={completionRate} />
                <ProgressBar label="Cancellation" value={cancellationRate} />
              </div>
            </SectionCard>

            <SectionCard title="Quick Summary">
              <div className="summary-grid">
                <div className="summary-box">
                  <p>HR</p>
                  <strong>{stats.hrScreening}</strong>
                </div>
                <div className="summary-box">
                  <p>Technical</p>
                  <strong>{stats.technical}</strong>
                </div>
                <div className="summary-box">
                  <p>Final</p>
                  <strong>{stats.final}</strong>
                </div>
                <div className="summary-box">
                  <p>Updated</p>
                  <strong>{stats.updatedCount}</strong>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
