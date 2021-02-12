enum ActiveDashboardPage {
  HOME = "home",
  INBOX = "messages",
  PAYMENTS = "payments",
  PROFILE = "profile",
}

type AsideProps = {
  activePage: string;
}

const activeStyles = "bg-gray-300 text-gray-900"

const Aside: React.FC<AsideProps> = (props) => {
  return (
    <aside className="lg:col-span-2">
      <div className="flex flex-col text-gray-700 text-lg space-y-2">
        <a className={`p-2 rounded ${props.activePage === ActiveDashboardPage.HOME ? activeStyles : ""}`} href="/home">Home</a>
        <a className={`p-2 rounded ${props.activePage === ActiveDashboardPage.INBOX ? activeStyles : ""}`} href="/messages">Messages</a>
        <a className={`p-2 rounded ${props.activePage === ActiveDashboardPage.PAYMENTS ? activeStyles : ""}`} href="/payments">Payments</a>
        <a className={`p-2 rounded ${props.activePage === ActiveDashboardPage.PROFILE ? activeStyles : ""}`} href="/profile">My Profile</a>
      </div>
    </aside>
  );
};

export default Aside;
