const navItems = [
    { label: "Projects", type: "route", to: "/projects" },
    { label: "Experience", type: "route", to: "/experience" },
    { label: "Music", type: "route", to: "/music" },
    { label: "About", type: "scroll", target: "about" }
]

const ProjectPageNav = ({ isNavExpanded, setIsNavExpanded, onNavItemClick, navigate }) => {
    return (
        <nav className={`absolute inset-x-0 top-0 px-6 py-8 md:px-12 lg:px-16 ${isNavExpanded ? "z-40" : "z-20"}`}>
            <div className="flex items-center justify-between">
                <a
                    href="/"
                    onClick={(event) => {
                        event.preventDefault()
                        setIsNavExpanded(false)
                        navigate("/")
                    }}
                    className="pointer-events-auto hidden items-center rounded-full px-3 py-2 text-sm uppercase tracking-[0.34em] text-stone-200 transition hover:text-white min-[553px]:inline-flex"
                    aria-label="Go to home"
                >
                    Home
                </a>
                <button
                    type="button"
                    onClick={() => setIsNavExpanded((current) => !current)}
                    className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 text-stone-100 min-[553px]:hidden"
                    aria-label={isNavExpanded ? "Close navigation" : "Open navigation"}
                    aria-expanded={isNavExpanded}
                >
                    <span className="relative block h-4 w-5">
                        <span className={`absolute left-0 top-0 h-px w-5 bg-current transition ${isNavExpanded ? "translate-y-[7px] rotate-45" : ""}`} />
                        <span className={`absolute left-0 top-[7px] h-px w-5 bg-current transition ${isNavExpanded ? "opacity-0" : ""}`} />
                        <span className={`absolute left-0 top-[14px] h-px w-5 bg-current transition ${isNavExpanded ? "-translate-y-[7px] -rotate-45" : ""}`} />
                    </span>
                </button>
                <div className="pointer-events-auto hidden items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-stone-400 min-[553px]:flex md:gap-6">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.type === "scroll" ? `/#${item.target}` : item.to}
                            onClick={(event) => onNavItemClick(event, item)}
                            className={[
                                "pointer-events-auto inline-flex items-center rounded-full px-3 py-2",
                                item.label === "Projects" ? "text-stone-100" : "transition hover:text-stone-200"
                            ].join(" ")}
                            aria-label={`Go to ${item.label.toLowerCase()}`}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
            {isNavExpanded ? (
                <div className="pointer-events-auto absolute left-6 top-[5.5rem] w-[min(16rem,calc(100vw-3rem))] rounded-[1.5rem] border border-white/10 bg-white/1 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-md min-[553px]:hidden">
                    <div className="flex flex-col items-start gap-1 text-[11px] uppercase tracking-[0.28em] text-stone-100/88">
                        <a
                            href="/"
                            onClick={(event) => {
                                event.preventDefault()
                                setIsNavExpanded(false)
                                navigate("/")
                            }}
                            className="pointer-events-auto inline-flex w-full items-center rounded-xl px-3 py-3 transition hover:bg-white/14 hover:text-white"
                            aria-label="Go to home"
                        >
                            Home
                        </a>
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.type === "scroll" ? `/#${item.target}` : item.to}
                                onClick={(event) => onNavItemClick(event, item)}
                                className={[
                                    "pointer-events-auto inline-flex w-full items-center rounded-xl px-3 py-3",
                                    item.label === "Projects" ? "bg-white/14 text-white" : "transition hover:bg-white/14 hover:text-white"
                                ].join(" ")}
                                aria-label={`Go to ${item.label.toLowerCase()}`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            ) : null}
        </nav>
    )
}

export default ProjectPageNav
