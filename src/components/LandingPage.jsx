import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';
import Hero from './Hero';
import AboutSection from './AboutSection';
import Programs from './Programs';
import ZakatCalculator from './ZakatCalculator';
import DonationAccounts from './DonationAccounts';
import Stats from './Stats';
import Gallery from './Gallery';
import Contact from './Contact';
import Footer from './Footer';
import DonationModal from './DonationModal';
import IntroVideoOverlay from './IntroVideoOverlay';

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
    const mainRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialDonation, setInitialDonation] = useState(null);
    const [showIntro, setShowIntro] = useState(() => {
        try {
            return sessionStorage.getItem('assholihin_show_intro') === '1';
        } catch {
            return false;
        }
    });

    const handleCloseIntro = () => {
        setShowIntro(false);
        try {
            sessionStorage.removeItem('assholihin_show_intro');
        } catch {
            // ignore
        }
    };

    const handleOpenDonate = (presetData = null) => {
        if (presetData && (presetData.amount || presetData.program)) {
            setInitialDonation(presetData);
        } else {
            setInitialDonation(null);
        }
        setIsModalOpen(true);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray('section');
            sections.forEach((sec) => {
                gsap.from(sec, {
                    opacity: 0,
                    y: 28,
                    duration: 0.75,
                    ease: 'power2.out',
                    clearProps: 'transform',
                    scrollTrigger: {
                        trigger: sec,
                        start: 'top 86%',
                        once: true
                    }
                });
            });
        }, mainRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="font-sans text-slate-800 bg-white min-h-screen flex flex-col">
            {showIntro && <IntroVideoOverlay onClose={handleCloseIntro} />}
            <Navbar onDonateClick={() => handleOpenDonate()} />

            <main ref={mainRef} className="flex-1">
                <Hero onDonateClick={(data) => handleOpenDonate(data)} />

                <AboutSection />

                <Programs onSelectProgram={(data) => handleOpenDonate(data)} />

                <ZakatCalculator onPayZakat={(data) => handleOpenDonate(data)} />

                <DonationAccounts onDonateClick={(data) => handleOpenDonate(data)} />

                <Stats />

                <Gallery />

                <Contact />

                {/* Section Pengajuan Adopsi Anak Online (Paling Bawah Beranda) */}
                <section id="ajukan-adopsi" className="py-12 lg:py-16 bg-gradient-to-b from-white to-mint/40 border-t border-slate-200/70">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-card p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-2 text-center md:text-left">
                                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-primary">
                                    Program Calon Orang Tua Angkat
                                </span>
                                <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">
                                    Ajukan Permohonan Adopsi Anak Secara Resmi
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                                    Lengkapi formulir pengajuan adopsi online sesuai ketentuan PP No. 54 Tahun 2007. Tim kami akan meninjau kelayakan dan menghubungi Anda melalui WhatsApp.
                                </p>
                            </div>
                            <Link
                                to="/pengajuan-adopsi"
                                className="btn-primary text-sm py-3 px-6 shrink-0 whitespace-nowrap"
                            >
                                Ajukan Adopsi Sekarang
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <DonationModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                initialData={initialDonation}
            />
        </div>
    );
}

export default LandingPage;
