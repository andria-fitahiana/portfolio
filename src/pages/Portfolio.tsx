import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "./Home";
import Formations from "./Formations";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";
import Experiences from "./Experiences";

export default function Portfolio() {
  return (
    <div>
      <Navbar />
      <main>
        <Home />
        <Projects />
        <Skills />
        <Experiences />
        <Formations />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}