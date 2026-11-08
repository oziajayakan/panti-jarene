import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function GalleryModal({ isOpen, onClose, item }) {
    if (!item) return null;

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl border border-slate-800">

                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        onClick={onClose}
                                        className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="flex flex-col md:flex-row h-[80vh] md:h-[600px]">
                                    {/* Image Section */}
                                    <div className="md:w-2/3 bg-black flex items-center justify-center overflow-hidden">
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* Info Section */}
                                    <div className="md:w-1/3 p-6 md:p-8 bg-white flex flex-col overflow-y-auto">
                                        <div className="mb-4">
                                            <span className="text-secondary text-xs font-bold tracking-wider uppercase bg-secondary/10 px-2 py-1 rounded-md">
                                                Dokumentasi
                                            </span>
                                        </div>

                                        <Dialog.Title as="h3" className="text-2xl font-heading font-bold leading-tight text-slate-900 mb-4">
                                            {item.title}
                                        </Dialog.Title>

                                        <div className="flex-1">
                                            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                                                {item.description || "Tidak ada deskripsi untuk kegiatan ini."}
                                            </p>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-slate-100">
                                            <p className="text-xs text-slate-400">
                                                Share momen ini:
                                            </p>
                                            <div className="flex gap-4 mt-2">
                                                {/* Placeholder for social buttons if needed, or just remove */}
                                                <button className="text-slate-400 hover:text-primary transition-colors text-sm font-medium">
                                                    Facebook
                                                </button>
                                                <button className="text-slate-400 hover:text-primary transition-colors text-sm font-medium">
                                                    Twitter
                                                </button>
                                                <button className="text-slate-400 hover:text-primary transition-colors text-sm font-medium">
                                                    WhatsApp
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
