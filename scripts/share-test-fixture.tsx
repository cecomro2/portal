import { createRoot } from "react-dom/client";
import { SharePost } from "../src/components/site/share-post";

createRoot(document.getElementById("root")!).render(<><span>16 de octubre de 2026</span><SharePost url="https://www.cecomro.com/prueba-blog" title="Innovación & desarrollo: Panamá" /><button type="button" style={{ position: "fixed", right: 8, top: 8 }}>Fuera del panel</button></>);
