import Navbar from '../components/Navbar';
import { useEagerConnect } from '../hooks';

const DefaultLayout: React.FC = (props) => {
  const triedEager = useEagerConnect();

  return (
    <>
      <div className="mx-auto">
        {
          props.children
        }
      </div>
    </>
  );
}

export default DefaultLayout;