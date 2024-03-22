import "./footer.css"

function Footer() {
    return (
        <div id="footer-container" className='h-full w-full flex align-items-center pl-4'>XDev &copy; {new Date().getFullYear()}</div>
    )
}

export default Footer