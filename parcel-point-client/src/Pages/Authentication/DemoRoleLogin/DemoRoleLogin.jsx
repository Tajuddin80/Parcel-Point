
import { useNavigate } from "react-router";

const DemoRoleLogin = ({ setCredentials, mode = "fill" }) => {
  const navigate = useNavigate();
  const demoAccounts = {
    admin: {
      email: "admin@gmail.com",
      password: "1234567Aa!",
    },
    user: {
      email: "user@gmail.com",
      password: "1234567Aa!",
    },
    rider: {
      email: "rider.khulna@gmail.com",
      password: "1234567Aa!",
    },
  };



  const handleClick = (role) => {
    //  Register page → redirect to signin
    if (mode === "redirect") {
      navigate("/signin", {
        state: {
          demoRole: role,
        },
      });
      return;
    }

    // 🔐 Login page → fill credentials
    setCredentials({
      email: demoAccounts[role].email,
      password: demoAccounts[role].password,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
      <button
        type="button"
        onClick={() => handleClick("user")}
        className="border border-green-400 text-green-600 py-2 rounded-md hover:bg-green-50"
      >
        Login as User
      </button>

      <button
        type="button"
        onClick={() => handleClick("admin")}
        className="border border-blue-400 text-blue-600 py-2 rounded-md hover:bg-blue-50"
      >
        Login as Admin
      </button>

      <button
        type="button"
        onClick={() => handleClick("rider")}
        className="border border-purple-400 text-purple-600 py-2 rounded-md hover:bg-purple-50"
      >
        Login as Rider
      </button>
    </div>
  );
};

export default DemoRoleLogin;

  