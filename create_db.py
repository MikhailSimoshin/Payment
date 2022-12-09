import sqlite3
import pandas as pd
import numpy as np
from hashlib import sha256

IDS_FILE = 'ids.txt'
TABLE_FILE = 'economic_game.xlsx'

con = sqlite3.connect("payments.sqlite")
cur = con.cursor()


def get_ids(from_file: str) -> set[str]:
    with open(from_file) as fr:
        return {line.strip() for line in fr.readlines()}


def assign_passwords(from_table: str, to_table: str, passwords: set[str]) -> pd.DataFrame:
    df = pd.read_excel(from_table)
    df['password'] = list(ids)[:len(df)]
    df.sort_values(by='grade', inplace=True)
    df.to_excel(to_table)
    return df


def create_tables() -> None:
    cur.execute("""CREATE TABLE players(player_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    firstname VARCHAR(255) NOT NULL,
                    middlename VARCHAR(255) NOT NULL,
                    lastname VARCHAR(255) NOT NULL,
                    grade INTEGER NOT NULL,
                    password VARCHAR(255) NOT NULL UNIQUE,
                    money INTEGER NOT NULL,
                    company INTEGER,
                    FOREIGN KEY (company) REFERENCES companies(company_id))""")

    cur.execute("""CREATE TABLE teachers(teacher_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    firstname VARCHAR(255) NOT NULL,
                    middlename VARCHAR(255) NOT NULL,
                    lastname VARCHAR(255) NOT NULL,
                    money INTEGER NOT NULL,
                    password VARCHAR(255) NOT NULL UNIQUE)""")

    cur.execute("""CREATE TABLE companies(company_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name VARCHAR(255) NOT NULL UNIQUE,
                    money INTEGER NOT NULL,
                    owner INTEGER NOT NULL,
                    FOREIGN KEY (owner) REFERENCES players(player_id))""")
    con.commit()


def fill_in_tables(df: pd.DataFrame) -> None:
    for _, row in df.iterrows():
        hashed_pass = sha256(row['password'].encode()).hexdigest()
        if row['grade'] is not np.nan:
            cur.execute("""
                        INSERT INTO players(firstname, middlename, lastname, grade, password, money, company)
                        VALUES (?, ?, ?, ?, ?, ?, ?) 
                        """, (row['firstname'], row['middlename'], row['lastname'], row['grade'], hashed_pass, 0, None)
                        )
        else:
            cur.execute("""
                        INSERT INTO teachers(firstname, middlename, lastname, password, money)
                        VALUES (?, ?, ?, ?, ?) 
                        """,
                        (row['firstname'], row['middlename'], row['lastname'], hashed_pass, 0)
                        )
    con.commit()


if __name__ == '__main__':

    ids = get_ids(from_file=IDS_FILE)
    table_name, extension = TABLE_FILE.rsplit('.', 1)
    df = assign_passwords(from_table=TABLE_FILE, to_table=f'{table_name}_with_passwords.{extension}', passwords=ids)
    create_tables()
    fill_in_tables(df)
    print('database created!')