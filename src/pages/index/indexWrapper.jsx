import { Outlet } from 'react-router'
import SiteNavBar from '../../components/partials/SiteNavBar'
// import SiteFooter from '../../components/partials/SiteFooter';

const IndexWrapper = () => {
    return (
        <>
          <SiteNavBar />
          <div className='homepage'>
                <Outlet />
            </div>
            {/* <SiteFooter /> */}
        </>
      )
    };

export default IndexWrapper;