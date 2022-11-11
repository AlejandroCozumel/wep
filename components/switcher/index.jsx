import React from 'react'
import { Switch } from "@headlessui/react";

const Switcher = ({checkOn, change}) => {
  return (
    <Switch
      checked={checkOn}
      onChange={change}
      className={`${checkOn ? "bg-green-600" : "bg-slate-400"}
          relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span
        aria-hidden="true"
        className={`${checkOn ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      />
    </Switch>
  )
}

export default Switcher