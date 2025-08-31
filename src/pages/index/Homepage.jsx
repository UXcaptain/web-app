import WaitlistHero from './waitlist/Hero.jsx';
import WaitlistSignupForm from './waitlist/SignupForm.jsx';
import WaitlistHowItWorks from './waitlist/HowItWorks.jsx';
import WaitlistFeatures from './waitlist/Features.jsx';
import WaitlistFAQ from './waitlist/FAQ.jsx';
import WaitlistNavBar from '../../components/partials/WaitlistNavBar.jsx';

const Homepage = () => {
    return (

        <div className="home-page">
      <WaitlistHero />
      <WaitlistSignupForm />
      <WaitlistHowItWorks />
      <WaitlistFeatures />
      <WaitlistFAQ />
    </div>
    )
}

export default Homepage;