import WaitlistHero from './waitlist/Hero.jsx';
import WaitlistSignupForm from './waitlist/SignupForm.jsx';
import WaitlistHowItWorks from './waitlist/HowItWorks.jsx';
import WaitlistFeatures from './waitlist/Features.jsx';
import WaitlistFAQ from './waitlist/FAQ.jsx';
import WaitlistLocalFooter from './waitlist/LocalFooter.jsx';

export const Waitlist = () => {
  return (
    <div className="waitlist-page">
      <WaitlistHero />
      <WaitlistSignupForm />
      <WaitlistHowItWorks />
      <WaitlistFeatures />
      <WaitlistFAQ />
      <WaitlistLocalFooter />
    </div>
  );
};

export default Waitlist;