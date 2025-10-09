import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function Navbar() {
    return (
        <div className="border">
            <div className="flex items-center justify-between px-4 py-2">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={navigationMenuTriggerStyle()}
                            >
                                <Link href="/">Home</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="flex items-center space-x-4">
                    <Link href="/purchase/viewOrder" className="hover:underline">
                        Cart
                    </Link>
                    <Link href="/profile" className="hover:underline">
                        Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}
