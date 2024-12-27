import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './Pages/LandingPage/HomePage';
import Login from './Pages/AuthenticationPage/Login';
import Registration from './Pages/AuthenticationPage/Registration';
import { Toaster } from 'sonner';

const App = () => {
    useEffect(() => {
        const handleScroll = () => {
            const element = document.getElementById("about");
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        };

        const aboutLink = document.querySelector('a[href="#about"]');
        if (aboutLink) {
            aboutLink.addEventListener("click", (event) => {
                event.preventDefault();
                handleScroll();
            });
        }

        return () => {
            if (aboutLink) {
                aboutLink.removeEventListener("click", handleScroll);
            }
        };
    }, []);

    return (
        <Router>
            <Toaster richColors />

            <div>
                <nav className='flex items-center justify-between h-14 3xl:h-28 '>
                    <div className='sm:ml-10 3xl:ml-32 2xl:ml-32'>
                        <h1 className='3xl:text-4xl'>VoteHub</h1>
                    </div>
                    <ul className='flex items-end justify-center gap-6 2xl:mr-32 sm:mr-10 3xl:text-4xl 3xl:mr-32'>
                        <li><Link className='rounded-lg hover:bg-blue-200 h-80' to="#homepage">Home</Link></li>
                        <li><Link to="#about">About</Link></li>
                        <li><Link to="#contact">Contact</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>

                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Registration />} />

                    {/* <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                 <Route path="*" element={<NotFound />} /> */}
                </Routes>
            </div>
        </Router>
    );
};

export default App
