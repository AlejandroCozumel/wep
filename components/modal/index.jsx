import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function MyModal({
  title,
  children,
  isOpen,
  onClose,
  cancelText,
  fullScreen
}) {
  const [showModal, setShowModal] = useState(isOpen);

  function closeModal() {
    onClose();
  }

  const windowSize = fullScreen ? "w-[80vw] transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all z-50" : "w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all z-50";

  return (
    <>
      <Transition appear show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className={windowSize}>
                  <Dialog.Title
                    as="h3"
                    className="text-xl text-bold font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2 pt-2">{children}</div>

                  <div className="mt-4 flex flex-col">
                      <button
                        type="button"
                        className="rounded-sm px-4 py-2 text-sm font-medium bg-red-500 text-gray-200 hover:bg-red-900 hover:text-gray-200 focus:outline-none"
                        onClick={closeModal}
                      >
                        {cancelText}
                      </button>
                      {/* <button
                        type="button"
                        className="rounded-sm px-4 py-2 text-sm font-medium bg-green-600 text-gray-200 hover:bg-green-900 hover:text-gray-200 focus:outline-none"
                        onClick={onSubmit}
                      >
                        {submitText}
                      </button> */}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
