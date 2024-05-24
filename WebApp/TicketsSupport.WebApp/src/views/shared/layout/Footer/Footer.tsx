import "./Footer.css"

function Footer() {
    return (
        <div id="footer-container" className='h-full w-full flex align-items-center pl-4'>Tickend &copy; {new Date().getFullYear()}</div>
    )
}

export default Footer