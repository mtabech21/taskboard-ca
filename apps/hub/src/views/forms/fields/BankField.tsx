import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shad/form";
import { Input } from "@shad/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@shad/select";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";


const bankList = [
  {
    "code": "001",
    "name": "Bank of Montreal"
  },
  {
    "code": "002",
    "name": "The Bank of Nova Scotia"
  },
  {
    "code": "003",
    "name": "Royal Bank of Canada"
  },
  {
    "code": "004",
    "name": "The Toronto-Dominion Bank"
  },
  {
    "code": "006",
    "name": "National Bank of Canada"
  },
  {
    "code": "010",
    "name": "Canadian Imperial Bank of Commerce"
  },
  {
    "code": "016",
    "name": "HSBC Bank Canada"
  },
  {
    "code": "030",
    "name": "Canadian Western Bank"
  },
  {
    "code": "039",
    "name": "Laurentian Bank of Canada"
  },
  {
    "code": 177,
    "name": "Bank of Canada"
  },
  {
    "code": 260,
    "name": "Citibank Canada"
  },
  {
    "code": 275,
    "name": "KEB Hana Bank Canada"
  },
  {
    "code": 290,
    "name": "UBS Bank (Canada)"
  },
  {
    "code": 294,
    "name": "SBI Canada Bank"
  },
  {
    "code": 303,
    "name": "Amex Bank of Canada"
  },
  {
    "code": 307,
    "name": "Industrial and Commercial Bank of China (Canada)"
  },
  {
    "code": 308,
    "name": "Bank of China (Canada)"
  },
  {
    "code": 309,
    "name": "Vancity Community Investment Bank"
  },
  {
    "code": 310,
    "name": "First Nations Bank of Canada"
  },
  {
    "code": 314,
    "name": "J.P. Morgan Bank Canada"
  },
  {
    "code": 315,
    "name": "CTBC Bank Corp. (Canada)"
  },
  {
    "code": 320,
    "name": "President's Choice Bank"
  },
  {
    "code": 321,
    "name": "Habib Canadian Bank"
  },
  {
    "code": 326,
    "name": "Canadian Imperial Bank of Commerce"
  },
  {
    "code": 334,
    "name": "VersaBank"
  },
  {
    "code": 338,
    "name": "Canadian Tire Bank"
  },
  {
    "code": 340,
    "name": "ICICI Bank Canada"
  },
  {
    "code": 343,
    "name": "ADS Canadian Bank"
  },
  {
    "code": 344,
    "name": "General Bank of Canada"
  },
  {
    "code": 347,
    "name": "Bridgewater Bank"
  },
  {
    "code": 352,
    "name": "Digital Commerce Bank"
  },
  {
    "code": 355,
    "name": "Shinhan Bank Canada"
  },
  {
    "code": 356,
    "name": "Citco Bank Canada"
  },
  {
    "code": 358,
    "name": "HomeEquity Bank"
  },
  {
    "code": 359,
    "name": "Duo Bank of Canada"
  },
  {
    "code": 361,
    "name": "Home Bank"
  },
  {
    "code": 368,
    "name": "Rogers Bank"
  },
  {
    "code": 370,
    "name": "Wealth One Bank of Canada"
  },
  {
    "code": 374,
    "name": "Motus Bank"
  },
  {
    "code": 376,
    "name": "Exchange Bank of Canada"
  },
  {
    "code": 377,
    "name": "RFA Bank of Canada"
  },
  {
    "code": 378,
    "name": "Cidel Bank Canada"
  },
  {
    "code": 381,
    "name": "Haventree Bank"
  },
  {
    "code": 382,
    "name": "Coast Capital Savings Federal Credit Union"
  },
  {
    "code": 383,
    "name": "Peoples Bank of Canada"
  },
  {
    "code": 540,
    "name": "Manulife Bank of Canada"
  },
  {
    "code": 608,
    "name": "CS Alterna Bank"
  },
  {
    "code": 614,
    "name": "Tangerine Bank"
  },
  {
    "code": 618,
    "name": "B2B Bank"
  },
  {
    "code": 623,
    "name": "Equitable Bank"
  },
  {
    "code": 853,
    "name": "Concentra Bank"
  },
  {
    "code": 241,
    "name": "Bank of America, National Association"
  },
  {
    "code": 242,
    "name": "The Bank of New York Mellon"
  },
  {
    "code": 245,
    "name": "MUFG Bank, Ltd., Canada Branch"
  },
  {
    "code": 250,
    "name": "BNP Paribas"
  },
  {
    "code": 265,
    "name": "Deutsche Bank AG"
  },
  {
    "code": 269,
    "name": "Mega International Commercial Bank Co., Ltd."
  },
  {
    "code": 270,
    "name": "JPMorgan Chase Bank, National Association"
  },
  {
    "code": 277,
    "name": "Mizuho Bank Ltd."
  },
  {
    "code": 301,
    "name": "Sumitomo Mitsui Banking Corporation, Canada Branch"
  },
  {
    "code": 318,
    "name": "U.S. Bank National Association"
  },
  {
    "code": 322,
    "name": "Rabobank Canada"
  },
  {
    "code": 323,
    "name": "Capital One Bank (Canada Branch)"
  },
  {
    "code": 327,
    "name": "State Street"
  },
  {
    "code": 328,
    "name": "Citibank, N.A"
  },
  {
    "code": 330,
    "name": "Comerica Bank"
  },
  {
    "code": 332,
    "name": "First Commercial Bank"
  },
  {
    "code": 335,
    "name": "United Overseas Bank Limited"
  },
  {
    "code": 345,
    "name": "Fifth Third Bank, National Association"
  },
  {
    "code": 346,
    "name": "Société Générale (Canada Branch)"
  },
  {
    "code": 349,
    "name": "The Northern Trust Company, Canada Branch"
  },
  {
    "code": 357,
    "name": "M & T Bank"
  },
  {
    "code": 360,
    "name": "Barclays Bank PLC, Canada Branch"
  },
  {
    "code": 362,
    "name": "Wells Fargo Bank, National Association, Canadian Branch"
  },
  {
    "code": 365,
    "name": "PNC Bank Canada Branch"
  },
  {
    "code": 366,
    "name": "China Construction Bank Toronto Branch"
  },
  {
    "code": 372,
    "name": "Bank of China, Toronto Branch"
  },
  {
    "code": 809,
    "name": "Central 1 Credit Union"
  },
  {
    "code": 815,
    "name": "Fédération des caisses Desjardins du Quebec"
  },
  {
    "code": 819,
    "name": "Caisse Populaire Group Financier Ltée"
  },
  {
    "code": 828,
    "name": "Central 1 Credit Union"
  },
  {
    "code": 829,
    "name": "Caisse Desjardins Ontario Credit Union Inc."
  },
  {
    "code": 839,
    "name": "Atlantic Central"
  },
  {
    "code": 849,
    "name": "Atlantic Central"
  },
  {
    "code": 865,
    "name": "Caisse populaire acadienne ltée"
  },
  {
    "code": 869,
    "name": "Central 1 Credit Union"
  },
  {
    "code": 879,
    "name": "Credit Union Central of Manitoba Limited"
  },
  {
    "code": 889,
    "name": "Credit Union Central of Saskatchewan"
  },
  {
    "code": 890,
    "name": "Caisse populaire Alliance Limitée"
  },
  {
    "code": 899,
    "name": "Credit Union Central Alberta Limited"
  },
  {
    "code": 702,
    "name": "Manufacturers Life Insurance Company"
  },
  {
    "code": 219,
    "name": "ATB Financial"
  },
  {
    "code": 701,
    "name": "Edward Jones"
  },
  {
    "code": 703,
    "name": "Wealthsimple Investments Inc."
  },
  {
    "code": 507,
    "name": "Community Trust Company"
  },
  {
    "code": 509,
    "name": "The Canada Trust Company"
  },
  {
    "code": 522,
    "name": "Trust La Laurentienne du Canada Inc."
  },
  {
    "code": 532,
    "name": "Effort Trust Company"
  },
  {
    "code": 536,
    "name": "Investors Group Trust Co. Ltd."
  },
  {
    "code": 548,
    "name": "CIBC Trust Corporation"
  },
  {
    "code": 550,
    "name": "Montreal Trust Company of Canada"
  },
  {
    "code": 551,
    "name": "Sun Life Financial Trust Inc."
  },
  {
    "code": 568,
    "name": "Peace Hills Trust Company"
  },
  {
    "code": 570,
    "name": "The Royal Trust Company"
  },
  {
    "code": 580,
    "name": "Royal Trust Corporation of Canada"
  },
  {
    "code": 590,
    "name": "National Trust Company"
  },
  {
    "code": 597,
    "name": "TD Mortgage Corporation"
  },
  {
    "code": 603,
    "name": "TD Pacific Mortgage Corporation"
  },
  {
    "code": 604,
    "name": "HSBC Mortgage Corporation (Canada)"
  },
  {
    "code": 606,
    "name": "Scotia Mortgage Corporation"
  },
  {
    "code": 612,
    "name": "Natcan Trust Company"
  },
  {
    "code": 621,
    "name": "Peoples Trust Company"
  },
  {
    "code": 626,
    "name": "Manulife Trust Company"
  },
  {
    "code": 627,
    "name": "Home Trust Company"
  }
]

export function BankInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: UseControllerProps<TFieldValues, TName> & { transit: FieldPath<TFieldValues>; institution: FieldPath<TFieldValues>; account: FieldPath<TFieldValues>; }) {
  return (
    <div className="flex flex-col gap-3">
      <FormLabel>Direct Deposit Information</FormLabel>
      <div className="flex gap-5 font-mono">
        <div className="w-[30%]">
          <FormField control={props.control} name={props.transit} render={({ field }) => <FormItem>
            <FormLabel className="text-xs text-gray-600">Transit</FormLabel>
            <FormControl>
              <Input maxLength={5} placeholder="00000" {...field} className="bg-white" />
            </FormControl>
            <FormMessage />
          </FormItem>} />
        </div>
        <div className="w-[20%]">
          <FormField control={props.control} name={props.institution} render={({ field }) => <FormItem>
            <FormLabel className="text-xs text-gray-600">Bank</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange} defaultValue="001">
                <SelectTrigger className="max-w-min bg-white" >
                  <div>{field.value}</div>
                </SelectTrigger>
                <SelectContent>
                  {bankList.map((bank) => (
                    <SelectItem key={bank.code} value={String(bank.code)}><div>
                      <div>{bank.code}</div>
                      <div className="text-gray-500 text-xs">{bank.name}</div>
                    </div>
                    </SelectItem>
                  ))}

                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>} />
        </div>
        <div className="w-[50%]">
          <FormField control={props.control} name={props.account} render={({ field }) => <FormItem>
            <FormLabel className="text-xs text-gray-600">Account Number</FormLabel>
            <FormControl>
              <Input maxLength={12} placeholder="0000000" {...field} className="bg-white" />
            </FormControl>
            <FormMessage />
          </FormItem>} />
        </div>
      </div>
    </div>
  );
}
