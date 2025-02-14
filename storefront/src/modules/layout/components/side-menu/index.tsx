"use client"

import { Popover, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

const SideMenuItems = {
  "Buy Peptides": "/store",
  Contact: "/contact",
  "Why Us": "/why-us",
  Search: "/search",
  Account: "/account",
}

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()

  return (
    <div className="relative">
      <Popover>
        {({ open, close }) => (
          <>
            {/* Toggle Button: Displays the menu image when closed, and the X icon when open */}
            <div className="flex items-center">
              <Popover.Button
                data-testid="nav-menu-button"
                className="flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
              >
                {open ? (
                  <span data-testid="close-menu-button">
                    <Image src="/cross.png" alt="Close Menu" width={40} height={40} />
                  </span>
                ) : (
                  <Image src="/menu.png" alt="Open Menu" width={40} height={40} />
                )}
              </Popover.Button>
            </div>

            {/* Full-Screen Menu Panel */}
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-150"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Popover.Panel
                className="fixed inset-0 z-30 bg-white bg-opacity-65 backdrop-blur-lg flex flex-col p-6 mt-24 overflow-auto">
                <div data-testid="nav-menu-popup" className="h-full flex flex-col justify-between">
                  <ul className="flex flex-col gap-4 items-start text-black mt-10">
                    {Object.entries(SideMenuItems).map(([name, href]) => (
                      <li key={name}>
                        <LocalizedClientLink
                          href={href}
                          className="text-xl leading-8 hover:text-ui-fg-disabled ml-8"
                          onClick={close}
                          data-testid={`${name.toLowerCase()}-link`}
                        >
                          {name}
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>

                  {/* Additional menu items or footer can go here */}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

export default SideMenu
