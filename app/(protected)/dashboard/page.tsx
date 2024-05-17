import { auth, signOut } from "@/auth";

async function ProtectedPage() {
  const session = await auth();

  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";

          await signOut({
            redirectTo: "/auth/login",
          });
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
}

export default ProtectedPage;
