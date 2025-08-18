import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import { renderComponent, renderSnippet } from "$lib/components/ui/data-table/index.js";

import DataTableButton from "$lib/components/(data-table)/batches/data-table-button.svelte";
import { dateTimeOptions } from "$lib/stores/store";
import { dateFormatter, timeFormatter } from "$lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PendingTransactions = {
  id: string;
  subject: string;
  donor_name: string;
  donor_email: string;
  text: string;
  uid: string;
  message: string;
  amount: number;
  datetime_utc: Date;
  donor_slack_id: string;
  active_batch_id?: string;
  random_string?: string;
  interac_email?: string;
  donor_id?: string;
};

export const columns: ColumnDef<PendingTransactions>[] = [
  //   {
  //   id: "select",
  //   header: ({ table }) =>
  //     renderComponent(Checkbox, {
  //       checked: table.getIsAllPageRowsSelected(),
  //       indeterminate:
  //         table.getIsSomePageRowsSelected() &&
  //         !table.getIsAllPageRowsSelected(),
  //       onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
  //       "aria-label": "Select all",
  //     }),
  //   cell: ({ row }) =>
  //     renderComponent(Checkbox, {
  //       checked: row.getIsSelected(),
  //       onCheckedChange: (value) => row.toggleSelected(!!value),
  //       "aria-label": "Select row",
  //     }),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "donor_name",
    header: ({ column }) =>
      renderComponent(DataTableButton, {
        text: "Donor",
        class: "uppercase text-md font-semibold",
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc")
      }),
  },
  {
    accessorKey: "donor_email",
    header: ({ column }) =>
      renderComponent(DataTableButton, {
        text: "Donor Email",
        class: "uppercase text-md font-semibold",
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc")
      }),
  },
  {
    accessorKey: "amount",
    header: ({ column }) =>
      renderComponent(DataTableButton, {
        text: "Amount",
        class: "uppercase text-md font-semibold",

        onclick: () => column.toggleSorting(column.getIsSorted() === "asc")
      }),
    // const amountHeaderSnippet = createRawSnippet(() => ({
    //   render: () => `<div class="text-right"></div>`,
    // }));
    // return renderSnippet(amountHeaderSnippet, "");

    cell: ({ row }) => {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "CAD",
        currencyDisplay: 'narrowSymbol'
      });

      const amountCellSnippet = createRawSnippet<[string]>((getAmount) => {
        const amount = getAmount();
        return {
          render: () => `<div class="font-medium">${amount}</div>`,
        };
      });

      return renderSnippet(
        amountCellSnippet,
        formatter.format(parseFloat(row.getValue("amount")))
      );
    },
  },
  {
    accessorKey: "datetime_utc",
    header: ({ column }) =>
      renderComponent(DataTableButton, {
        text: "Transaction Date",
        class: "uppercase text-md font-semibold",
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc")
      }),
    cell: ({ row }) => {
      const formatter = new Intl.DateTimeFormat("en-US", dateTimeOptions.options);

      const amountCellSnippet = createRawSnippet<[string]>(() => {
        // const date = getDate();
        return {
          render: () => `
            <div class='text-sm'>
                <p class="mb-px text-muted-foreground flex gap-2 flex-wrap items-center mt-1"> 
                <iconify-icon icon="uiw:date"></iconify-icon> 
                ${dateFormatter.format(new Date(row.original.datetime_utc))}
                </p>
                <p class="mb-px text-muted-foreground flex gap-2 flex-wrap items-center">
                <iconify-icon icon="uiw:time"></iconify-icon> 
                ${timeFormatter.format(new Date(row.original.datetime_utc))}
                </p>
              </div>
            `,
        };
      });

      return renderSnippet(amountCellSnippet, "");
    }
  },
  {
    accessorKey: "message",
    header: ({ column }) =>
      renderComponent(DataTableButton, {
        text: "Interac Message",
        class: "uppercase text-md font-semibold",
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc")
      }),
    cell: ({ row }) => {
      const amountCellSnippet = createRawSnippet<[string]>((getMessage) => {
        const msg = getMessage() ?? '';
        return {
          render: () => `<div class='text-wrap'>${msg}</div>`,
        };
      });

      return renderSnippet(
        amountCellSnippet,
        row.getValue("message")
      );
    }
  },
  // {
  //   accessorKey: "id",
  //   header: "",
  //   cell: ({ row }) => {
  //     // You can pass whatever you need from `row.original` to the component
  //     return renderComponent(PendingTableActions, { record: row.original });
  //   },
  //   enableHiding: false,
  // },
];