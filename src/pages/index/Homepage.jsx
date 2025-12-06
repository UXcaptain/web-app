import MainHero from './waitlist/Hero.jsx';
import WaitlistSignupForm from './waitlist/SignupForm.jsx';
import HowItWorks from './waitlist/HowItWorks.jsx';
import Features from './waitlist/Features.jsx';
import FAQ from './waitlist/FAQ.jsx';
import RecordingExample from '../../components/RecordingExample.jsx';
import CompaniesLogoStrip from './waitlist/CompaniesLogoStrip.jsx';
import DashboardExample from '../../components/DashboardExample.jsx';

const Homepage = () => {
    return (

        <div className="home-page">
      <MainHero />
      {/* <CompaniesLogoStrip />
      <RecordingExample /> */}
      <HowItWorks />
      <DashboardExample />
      <Features />
      <FAQ />
    </div>
    )
}

export default Homepage;