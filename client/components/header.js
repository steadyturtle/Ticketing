import Link from "next/link";

export default ({ currentUser }) => {
  const Links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((link) => link)
    .map(({ label, href }) => (
      <li className="nav-item">
        <Link href={href}>
          <a className="nav-link">{label}</a>
        </Link>
      </li>
    ));
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand mx-2">Git Tix</a>
      </Link>
      <div className="d-flex justify-content-end ">
        <div className="nav d-flex align-content-center m-2">{Links}</div>
      </div>
    </nav>
  );
};
