export default function Profile() {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return (

    <div>

      <h1
        className="
          text-3xl
          font-bold
        "
      >
        Profile
      </h1>

      <div
        className="
          mt-8
          max-w-xl
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          p-6
        "
      >

        <p>
          <strong>Name:</strong>{" "}
          {user.name}
        </p>

        <p
          className="
            mt-4
          "
        >
          <strong>Email:</strong>{" "}
          {user.email}
        </p>

        <p
          className="
            mt-4
          "
        >
          <strong>Role:</strong>{" "}
          {user.role}
        </p>

      </div>

    </div>

  );
}