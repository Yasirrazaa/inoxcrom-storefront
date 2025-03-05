export interface Address {
  /**
   * The address's ID.
   */
  id: string;
  /**
   * The address's name.
   */
  address_name: string | null;
  /**
   * Whether the address is used by default for shipping.
   */
  is_default_shipping: boolean;
  /**
   * Whether the address is used by default for billing.
   */
  is_default_billing: boolean;
  /**
   * The ID of the customer this address belongs to.
   */
  customer_id: string;
  /**
   * The address's company.
   */
  company: string | null;
  /**
   * The address's first name.
   */
  first_name: string | null;
  /**
   * The address's last name.
   */
  last_name: string | null;
  /**
   * The address's first line.
   */
  address_1: string | null;
  /**
   * The address's second line.
   */
  address_2: string | null;
  /**
   * The address's city.
   */
  city: string | null;
  /**
   * The address's country code.
   *
   * @example
   * us
   */
  country_code: string | null;
  /**
   * The address's province.
   */
  province: string | null;
  /**
   * The address's postal code.
   */
  postal_code: string | null;
  /**
   * The address's phone number.
   */
  phone: string | null;
  /**
   * Key-value pairs of custom data.
   */
  metadata: Record<string, unknown> | null;
  /**
   * The date the address was created.
   */
  created_at: string;
  /**
   * The date the address was updated.
   */
  updated_at: string;
}