import AddConferenceButton from "@/components/add-conference-button";
import AppPage from "@/components/app-page";
import MyConferenceList from "@/components/my-conference-list";
import { NO_PERMISSION } from "@/lib/error-messages";
import { verifySession } from "@/lib/session";

export default async function AdminPage() {
  const session = await verifySession();
  if (!session.isAuth) {
    throw new Error(NO_PERMISSION);
  }

  return (
    <AppPage>
      <h1 className="text-2xl md:text-5xl font-bold">Admin</h1>

      <div className="mt-10">
        <h2 className="text-2xl md:text-4xl font-semibold">
          Manage My Conferences
        </h2>
        <div className="mt-4">
          <AddConferenceButton />
        </div>
        <div className="mt-10">
          <MyConferenceList />
        </div>
      </div>
    </AppPage>
  );
}
