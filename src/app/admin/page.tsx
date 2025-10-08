import Link from "next/link";
import MyConferenceList from "@/components/my-conference-list";

export default function AdminPage() {
  return (
    <div>
      <Link href="/" replace>
        <span className="text-sm text-accent">Back to Home</span>
      </Link>

      <h1>Admin</h1>

      <div>
        <Link href="/admin/conference/create">Create new conference</Link>
        <h2>Manage My Conferences</h2>

        <div>
          <div className="p-4">
            <MyConferenceList />
          </div>
        </div>
      </div>
    </div>
  );
}
