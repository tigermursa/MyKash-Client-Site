import Services from "../components/services/Services";
import ServicesGrid from "../components/services/ServicesGrid";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Services />
      <ServicesGrid />
      <div className="mt-8 space-y-4 px-4">
        <img
          src="https://www.bkash.com/uploaded_contents/campaigns/large_images/web-banner-1458x540_1732192439091.webp"
          alt="Offer 1"
          className="w-full object-cover rounded-md shadow-lg"
        />
        <img
          src="https://www.bkash.com/uploaded_contents/campaigns/large_images/book-fair-online-1458x540_1738559979393.webp"
          alt="Offer 2"
          className="w-full object-cover rounded-md shadow-lg"
        />
        <img
          src="https://www.bkash.com/uploaded_contents/campaigns/large_images/web-banner-1458x540-51_1729074419388.webp"
          alt="Offer 3"
          className="w-full object-cover rounded-md shadow-lg"
        />
      </div>
    </div>
  );
};

export default Home;
