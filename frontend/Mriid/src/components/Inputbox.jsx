export function Inputbox({ label, onChange, placeholder }) {
    return (
      <div>
        <label className="uppercase text-blueGray-600 text-xs font-medium mb-2 block">
          {label}
        </label>
        <input
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-3 mb-4 border placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
        />
      </div>
    );
  }