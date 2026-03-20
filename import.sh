#!/usr/bin/env sh

# Import data from specified xlsx file
# Requires csvkit (in2csv, csvcut, csvformat)

if [ -z "$1" -o "$#" -ne 1 ]; then
  echo "Usage: import.sh <spreadsheet>.xlsx";
  exit 0;
fi

INPUT_FILE=$1

convert_sheet() {
  INPUT_SHEET=$1
  OUTPUT_FILE=$2

  echo "Sheet $INPUT_SHEET"
  in2csv --sheet="$INPUT_SHEET" "$INPUT_FILE" | csvcut -x | csvformat -U 1 > $2
}

convert_sheet drinkCategories      src/content/categories/drinks.csv
convert_sheet foodCategories       src/content/categories/food.csv
convert_sheet drinks               src/content/products/drinks.csv
convert_sheet food                 src/content/products/food.csv

convert_sheet drinkCategoriesEn    src/content/l10n/en/categories/drinks.csv
convert_sheet foodCategoriesEn     src/content/l10n/en/categories/food.csv
convert_sheet drinksEn             src/content/l10n/en/products/drinks.csv
convert_sheet foodEn               src/content/l10n/en/products/food.csv
