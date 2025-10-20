import MainHero from './waitlist/Hero.jsx';
import WaitlistSignupForm from './waitlist/SignupForm.jsx';
import HowItWorks from './waitlist/HowItWorks.jsx';
import Features from './waitlist/Features.jsx';
import WaitlistFAQ from './waitlist/FAQ.jsx';
import WaitlistNavBar from '../../components/partials/WaitlistNavBar.jsx';
import RecordingExample from '../../components/RecordingExample.jsx';
import CompaniesLogoStrip from './waitlist/CompaniesLogoStrip.jsx';

const Homepage = () => {
    return (

        <div className="home-page">
      <MainHero />
      <CompaniesLogoStrip />
      <HowItWorks />
      {/* <RecordingExample /> */}
      <Features />
      <WaitlistFAQ />
    </div>
    )
}

export default Homepage;