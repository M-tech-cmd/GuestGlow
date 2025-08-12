# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



       
cd client
  npm install
  npm run dev

npm install tailwindcss @tailwindcss/vite

UI(prebuiltui.com)
{
  "id": "user_2zYNuN7aiMUGuszginc0wWZ3ccq",
  "object": "user",
  "username": null,
  "first_name": null,
  "last_name": null,
  "image_url": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ6WU9Ba0VZSHZhSWNFcFd3Z0toWGRvVVZKSyJ9",
  "has_image": true,
  "primary_email_address_id": "idn_2zYNuGWCPoruE5rUaSRvOm42mtt",
  "primary_phone_number_id": null,
  "primary_web3_wallet_id": null,
  "password_enabled": true,
  "two_factor_enabled": false,
  "totp_enabled": false,
  "backup_code_enabled": false,
  "email_addresses": [
    {
      "id": "idn_2zYNuGWCPoruE5rUaSRvOm42mtt",
      "object": "email_address",
      "email_address": "kimaniemma20@gmail.com",
      "reserved": false,
      "verification": {
        "status": "verified",
        "strategy": "admin",
        "attempts": null,
        "expire_at": null
      },
      "linked_to": [],
      "matches_sso_connection": false,
      "created_at": 1751904267568,
      "updated_at": 1751904267568
    }
  ],
  "phone_numbers": [],
  "web3_wallets": [],
  "passkeys": [],
  "external_accounts": [],
  "saml_accounts": [],
  "enterprise_accounts": [],
  "password_last_updated_at": 1751904267565,
  "public_metadata": {},
  "private_metadata": {},
  "unsafe_metadata": {},
  "external_id": null,
  "last_sign_in_at": null,
  "banned": false,
  "locked": false,
  "lockout_expires_in_seconds": null,
  "verification_attempts_remaining": 100,
  "created_at": 1751904267565,
  "updated_at": 1751904267571,
  "delete_self_enabled": true,
  "create_organization_enabled": true,
  "last_active_at": null,
  "mfa_enabled_at": null,
  "mfa_disabled_at": null,
  "legal_accepted_at": null,
  "profile_image_url": "https://www.gravatar.com/avatar?d=mp"
}

 <form className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8  flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>

            <div>
                <div className='flex items-center gap-2'>
                   <img src={assets.calenderIcon} alt="" className="h-4" />
                    <label htmlFor="destinationInput">Destination</label>
                </div>
                <input list='destinations' id="destinationInput" type="text" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" placeholder="Type here" required />

                <datalist id="destinations">
                    {cities.map((city, index)=>(
                        <option value={city} key={index}/>
                    ))}
                </datalist>
            </div>

            <div>
                <div className='flex items-center gap-2'>
                    <img src={assets.calenderIcon} alt="" className="h-4" /> 
                    <label htmlFor="checkIn">Check in</label>
                </div>
                <input id="checkIn" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
            </div>

            <div>
                <div className='flex items-center gap-2'>
                   <img src={assets.calenderIcon} alt="" className="h-4" />
                    <label htmlFor="checkOut">Check out</label>
                </div>
                <input id="checkOut" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
            </div>

            <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                <label htmlFor="guests">Guests</label>
                <input min={1} max={4} id="guests" type="number" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16" placeholder="0" />
            </div>

            <button className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1' >
                <img src={assets.searchIcon} alt="searchIcon" className="h-7" />
                <span>Search</span>
            </button>
        </form>

