import Shoe from 'rc-footer';
import 'rc-footer/assets/index.css';

const Footer: React.FC = () => {
  return (
    <Shoe columns={[
      {
        icon: (
          <a href="https://twitter.com/hashingsystems" target="_blank"><img src="images/twitter.png" />
              </a>),
      },{
        icon: (
          <a href="https://facebook.com/hashingsystems" target="_blank"><img src="images/facebook.png" />
              </a>),
      },
    ]} 
    bottom="Made with ❤️ by Hashing Systems"
  />
  );
};

export default Footer;