#!/usr/bin/env python

# import pandas as pd
from pathlib import Path
import csv
import cytoolz.curried as cc
import itertools as it
from pprint import pp

# csv_path = list(Path.cwd().glob('*.csv'))[0]

# csv_df = pd.read_csv(csv_path)

# cleaned_df = pd.DataFrame(data=csv_lst_combined, columns=csv_lst[0])


def read_expenditure_csv(csv_path):
    csv_lst = []
    with open(csv_path, newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        next(spamreader)
        for row in spamreader:
            csv_lst.append(row)

    csv_lst_paired = cc.pipe(
        csv_lst
        , lambda lst: (lst, cc.drop(1, [x for x in lst]))
        , lambda pair: it.zip_longest(*pair)
        , list
    )

    return csv_lst_paired


def cleanup_expenditure_csv(csv_pair_list):
    csv_lst_combined = []
    for row_pair in csv_pair_list:
        if row_pair[0] is None:
            csv_lst_combined.append(row_pair[1])
        elif row_pair[1] is None:
            csv_lst_combined.append(row_pair[0])
        elif len(row_pair[0]) == 24:
            csv_lst_combined.append(row_pair[0])
        elif 15 < len(row_pair[0]) < 24:
            combined_lst = (row_pair[0] + row_pair[1])[:-1]
            csv_lst_combined.append(combined_lst)

    return csv_lst_combined
