"use client"

import { Dialog, Transition } from "@headlessui/react";
import { Button, clx } from "@medusajs/ui";
import React, { Fragment, useMemo } from "react";
import useToggleState from "@lib/hooks/use-toggle-state";
import ChevronDown from "@modules/common/icons/chevron-down";
import X from "@modules/common/icons/x";
import { getProductPrice } from "@lib/util/get-product-price";
import OptionSelect from "./option-select";
import { HttpTypes } from "@medusajs/types";

type MobileActionsProps = {
  product: HttpTypes.StoreProduct;
  variant?: HttpTypes.StoreProductVariant;
  options: Record<string, string | undefined>;
  updateOptions: (title: string, value: string) => void;
  inStock?: boolean;
  handleAddToCart: () => void;
  isAdding?: boolean;
  show: boolean;
  optionsDisabled: boolean;
  quantity: number;
  updateQuantity: (newQuantity: number) => void;
  errorMessage?: string;
};

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
  quantity,
  updateQuantity,
  errorMessage,
}) => {
  const dialogState = useToggleState(false);

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  });

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null;
    }
    const { variantPrice, cheapestPrice } = price;

    return variantPrice || cheapestPrice || null;
  }, [price]);

  const isOutOfStock = variant && (
    ('inventory_quantity' in variant &&
    variant.manage_inventory &&
    !variant.allow_backorder &&
    (variant.inventory_quantity ?? 0) === 0) ||
    errorMessage?.toLowerCase().includes('out of stock')
  );

  return (
    <>
      <div
        className={clx("lg:hidden inset-x-0 bottom-0 fixed", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="bg-white flex flex-col gap-y-3 justify-center items-center text-large-regular p-4 h-full w-full border-t border-gray-200"
            data-testid="mobile-actions"
          >
            <div className="flex items-center gap-x-2">
              <span data-testid="mobile-title">{product.title}</span>
              <span>—</span>
              {selectedPrice ? (
                <div className="flex items-end gap-x-2 text-ui-fg-base">
                  {selectedPrice.price_type === "sale" && (
                    <p>
                      <span className="line-through text-small-regular">
                        {selectedPrice.original_price}
                      </span>
                    </p>
                  )}
                  <span
                    className={clx({
                      "text-ui-fg-interactive":
                        selectedPrice.price_type === "sale",
                    })}
                  >
                    {selectedPrice.calculated_price}
                  </span>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="flex flex-col w-full gap-y-2">
              <Button
                onClick={dialogState.open}
                variant={(variant && (!inStock || isOutOfStock)) ? "danger" : "secondary"}
                className="w-full h-12"
                data-testid="mobile-actions-button"
              >
                <div className="flex items-center justify-between w-full">
                  <span>
                    {variant
                      ? Object.values(options).join(" / ")
                      : "Select Options"}
                  </span>
                  <ChevronDown />
                </div>
              </Button>
              <div className="flex gap-2 w-full">
                <Button
                  onClick={handleAddToCart}
                  disabled={
                    !inStock || 
                    !variant || 
                    isOutOfStock
                  }
                  variant={
                    !inStock || isOutOfStock
                      ? "danger"
                      : "primary"
                  }
                  className="flex-1 h-12 font-medium"
                  isLoading={isAdding}
                  data-testid="mobile-cart-button"
                >
                  {!variant
                    ? "Select variant"
                    : !inStock || isOutOfStock
                    ? "Out of stock"
                    : `Add to cart${quantity > 1 ? ` (${quantity})` : ''}`}
                </Button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <Transition appear show={dialogState.state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={dialogState.close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed bottom-0 inset-x-0">
            <div className="flex min-h-full h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel
                  className="w-full h-full transform overflow-hidden text-left flex flex-col gap-y-3"
                  data-testid="mobile-actions-modal"
                >
                  <div className="w-full flex justify-end pr-6">
                    <button
                      onClick={dialogState.close}
                      className="bg-white w-12 h-12 rounded-full text-ui-fg-base flex justify-center items-center"
                      data-testid="close-modal-button"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="bg-white px-6 py-12 flex flex-col gap-y-6">
                    {(product.variants?.length ?? 0) > 1 && (
                      <>
                        {(product.options || []).map((option) => {
                          return (
                            <div key={option.id}>
                              <OptionSelect
                                option={option}
                                current={options[option.title ?? ""]}
                                updateOption={updateOptions}
                                title={option.title ?? ""}
                                disabled={optionsDisabled}
                              />
                            </div>
                          )
                        })}
                      </>
                    )}

                    {/* Mobile Quantity Controls */}
                    {variant && inStock && !isOutOfStock && (
                      <div className="flex flex-col gap-y-2">
                        <span className="text-ui-fg-base font-medium">Quantity</span>
                        <div className="flex items-center">
                          <div className="flex items-center border rounded-md">
                            <button
                              className="px-4 py-2 border-r hover:bg-gray-100"
                              onClick={() => updateQuantity(quantity - 1)}
                              disabled={quantity <= 1}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value)
                                if (val > 0) {
                                  updateQuantity(val)
                                }
                              }}
                              className="w-16 text-center border rounded-md p-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              className="px-4 py-2 border-l hover:bg-gray-100"
                              onClick={() => updateQuantity(quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Mobile Error Message */}
                        {errorMessage && (
                          <span className="text-rose-500 text-sm">
                            {errorMessage}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Error Message (only for quantity errors) */}
                    {errorMessage && !errorMessage.toLowerCase().includes('out of stock') && (
                      <div className="mt-2">
                        <span className="text-rose-500 text-sm">
                          {errorMessage}
                        </span>
                      </div>
                    )}
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

export default MobileActions;
