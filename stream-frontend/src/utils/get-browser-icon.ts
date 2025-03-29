import { FaChrome, FaFirefoxBrowser, FaSafari, FaEdge, FaOpera, FaYandex } from "react-icons/fa";
import { CircleHelp } from "lucide-react";

export function getBrowserIcon(browser: string) {
    switch (browser.toLowerCase()) {
        case "chrome":
            return FaChrome;
        case "firefox":
            return FaFirefoxBrowser;
        case "safari":
            return FaSafari;
        case "edge":
        case "microsoft edge":
            return FaEdge;
        case "opera":
            return FaOpera;
        case "yandex":
        case "yandex browser":
            return FaYandex;
        default:
            return CircleHelp;
    }
}
