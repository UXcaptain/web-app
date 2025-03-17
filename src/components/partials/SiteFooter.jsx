import { NavLink } from "react-router";

const SiteFooter = () => {
    return (
        <div className="footer">

    <nav className="container py-2 border-bottom footer">

            <div className="">
                <ul>
                <li>
                    <NavLink to="/terminos-condiciones">Términos y condiciones</NavLink>
                </li>
                    <li>Site-Footer</li>
                    <li>Item 3</li>
                    <li>Item 4</li>
                </ul>
            </div>

            <div className="">
                <ul>
                    <li>Item 5</li>
                    <li>Item 6</li>
                    <li>Item 7</li>
                    <li>Item 8</li>
                </ul>
            </div>
            <div className="">
                <ul>
                    <li>Item 9</li>
                    <li>Item 10</li>
                    <li>Item 11</li>
                    <li>Item 12</li>
                </ul>
            </div>
            
    </nav>
</div>
    )
}

export default SiteFooter;