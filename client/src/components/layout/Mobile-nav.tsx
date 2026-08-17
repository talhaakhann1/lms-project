import { cn } from "@/src/lib/utils";
import React from "react";
import { Button, buttonVariants } from "../../components/ui/button";
import { Portal, PortalBackdrop } from "../../components/ui/portal";
import { navLinks } from "../../components/layout/Header";
import { XIcon, MenuIcon } from "lucide-react";
import Link from "next/link";

export function MobileNav() {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="md:hidden">
            <Button
                aria-controls="mobile-menu"
                aria-expanded={open}
                aria-label="Toggle menu"
                className="md:hidden"
                onClick={() => setOpen(!open)}
                size="icon"
                variant="outline"
            >
                {open ? (
                    <XIcon className="size-4.5" />
                ) : (
                    <MenuIcon className="size-4.5" />
                )}
            </Button>
            {open && (
                <Portal className="top-14" id="mobile-menu">
                    <PortalBackdrop />
                    <div
                        className={cn(
                            "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
                            "size-full p-4"
                        )}
                        data-slot={open ? "open" : "closed"}
                    >
                        <div className="grid gap-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={buttonVariants({
                                        variant: "ghost",
                                        className: "justify-start",
                                    })}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-12 flex flex-col gap-2">
                            <Button className="height: calc(var(--spacing)*10)" variant="outline">
                                Sign In
                            </Button>
                            <Button className="w-full">Get Started</Button>
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    );
}
