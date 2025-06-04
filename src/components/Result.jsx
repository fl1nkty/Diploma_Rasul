// src/components/Result.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import alasql from 'alasql';
import Papa from 'papaparse';

function Result() {
  // Читаем SQL-текст из Redux (редьюсер называется `query`)
  const queryText = useSelector((state) => state.query);

  const [resultRows, setResultRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [currentTableName, setCurrentTableName] = useState('');

  // “Вшитые” данные для таблицы people (200 записей)
  const peopleData = [
    { id: 1, first_name: 'James',    last_name: 'Hernandez', age: 65, country: 'Germany' },
    { id: 2, first_name: 'Sarah',    last_name: 'Walker',    age: 28, country: 'United Kingdom' },
    { id: 3, first_name: 'Thomas',   last_name: 'Lopez',     age: 34, country: 'Canada' },
    { id: 4, first_name: 'Sarah',    last_name: 'Brown',     age: 27, country: 'Australia' },
    { id: 5, first_name: 'Kevin',    last_name: 'Johnson',   age: 45, country: 'Mexico' },
    { id: 6, first_name: 'Sarah',    last_name: 'Garcia',    age: 29, country: 'United States' },
    { id: 7, first_name: 'Thomas',   last_name: 'Martinez',  age: 33, country: 'Brazil' },
    { id: 8, first_name: 'Sarah',    last_name: 'Lee',       age: 24, country: 'France' },
    { id: 9, first_name: 'Lisa',     last_name: 'Walker',    age: 39, country: 'Japan' },
    { id: 10, first_name: 'Sarah',   last_name: 'Brown',     age: 26, country: 'India' },
    { id: 11, first_name: 'Kevin',   last_name: 'Moore',     age: 37, country: 'Germany' },
    { id: 12, first_name: 'Sarah',   last_name: 'Johnson',   age: 28, country: 'United Kingdom' },
    { id: 13, first_name: 'Thomas',  last_name: 'Allen',     age: 35, country: 'Canada' },
    { id: 14, first_name: 'Sarah',   last_name: 'Jackson',   age: 27, country: 'Australia' },
    { id: 15, first_name: 'Kevin',   last_name: 'White',     age: 50, country: 'Mexico' },
    { id: 16, first_name: 'Sarah',   last_name: 'Rodriguez', age: 29, country: 'United States' },
    { id: 17, first_name: 'Thomas',  last_name: 'Hill',      age: 44, country: 'Brazil' },
    { id: 18, first_name: 'Sarah',   last_name: 'Young',     age: 26, country: 'France' },
    { id: 19, first_name: 'Lisa',    last_name: 'Garcia',    age: 31, country: 'Japan' },
    { id: 20, first_name: 'Sarah',   last_name: 'Brown',     age: 23, country: 'India' },
    { id: 21, first_name: 'Kevin',   last_name: 'Davis',     age: 38, country: 'Germany' },
    { id: 22, first_name: 'Sarah',   last_name: 'Lopez',     age: 28, country: 'United Kingdom' },
    { id: 23, first_name: 'Thomas',  last_name: 'Smith',     age: 35, country: 'Canada' },
    { id: 24, first_name: 'Sarah',   last_name: 'Taylor',    age: 27, country: 'Australia' },
    { id: 25, first_name: 'Kevin',   last_name: 'Anderson',  age: 41, country: 'Mexico' },
    { id: 26, first_name: 'Sarah',   last_name: 'Martinez',  age: 29, country: 'United States' },
    { id: 27, first_name: 'Thomas',  last_name: 'Jackson',   age: 33, country: 'Brazil' },
    { id: 28, first_name: 'Sarah',   last_name: 'White',     age: 24, country: 'France' },
    { id: 29, first_name: 'Lisa',    last_name: 'Harris',    age: 40, country: 'Japan' },
    { id: 30, first_name: 'Sarah',   last_name: 'Thompson',  age: 23, country: 'India' },
    { id: 31, first_name: 'Kevin',   last_name: 'Robinson',  age: 35, country: 'Germany' },
    { id: 32, first_name: 'Sarah',   last_name: 'Walker',    age: 28, country: 'United Kingdom' },
    { id: 33, first_name: 'Thomas',  last_name: 'Perez',     age: 34, country: 'Canada' },
    { id: 34, first_name: 'Sarah',   last_name: 'Hall',      age: 26, country: 'Australia' },
    { id: 35, first_name: 'Kevin',   last_name: 'Lopez',     age: 45, country: 'Mexico' },
    { id: 36, first_name: 'Sarah',   last_name: 'Young',     age: 29, country: 'United States' },
    { id: 37, first_name: 'Thomas',  last_name: 'Allen',     age: 32, country: 'Brazil' },
    { id: 38, first_name: 'Sarah',   last_name: 'Scott',     age: 28, country: 'France' },
    { id: 39, first_name: 'Lisa',    last_name: 'Adams',     age: 40, country: 'Japan' },
    { id: 40, first_name: 'Sarah',   last_name: 'Baker',     age: 23, country: 'India' },
    { id: 41, first_name: 'Kevin',   last_name: 'Mitchell',  age: 38, country: 'Germany' },
    { id: 42, first_name: 'Sarah',   last_name: 'Perez',     age: 28, country: 'United Kingdom' },
    { id: 43, first_name: 'Thomas',  last_name: 'Roberts',   age: 35, country: 'Canada' },
    { id: 44, first_name: 'Sarah',   last_name: 'Turner',    age: 27, country: 'Australia' },
    { id: 45, first_name: 'Kevin',   last_name: 'Phillips',  age: 41, country: 'Mexico' },
    { id: 46, first_name: 'Sarah',   last_name: 'Campbell',  age: 29, country: 'United States' },
    { id: 47, first_name: 'Thomas',  last_name: 'Parker',    age: 34, country: 'Brazil' },
    { id: 48, first_name: 'Sarah',   last_name: 'Evans',     age: 26, country: 'France' },
    { id: 49, first_name: 'Lisa',    last_name: 'Edwards',   age: 40, country: 'Japan' },
    { id: 50, first_name: 'Sarah',   last_name: 'Collins',   age: 23, country: 'India' },
    { id: 51, first_name: 'Kevin',   last_name: 'Stewart',   age: 35, country: 'Germany' },
    { id: 52, first_name: 'Sarah',   last_name: 'Sanchez',   age: 28, country: 'United Kingdom' },
    { id: 53, first_name: 'Thomas',  last_name: 'Morris',    age: 32, country: 'Canada' },
    { id: 54, first_name: 'Sarah',   last_name: 'Rogers',    age: 27, country: 'Australia' },
    { id: 55, first_name: 'Kevin',   last_name: 'Reed',      age: 41, country: 'Mexico' },
    { id: 56, first_name: 'Sarah',   last_name: 'Cook',      age: 29, country: 'United States' },
    { id: 57, first_name: 'Thomas',  last_name: 'Morgan',    age: 34, country: 'Brazil' },
    { id: 58, first_name: 'Sarah',   last_name: 'Bell',      age: 26, country: 'France' },
    { id: 59, first_name: 'Lisa',    last_name: 'Murphy',    age: 40, country: 'Japan' },
    { id: 60, first_name: 'Sarah',   last_name: 'Bailey',    age: 23, country: 'India' },
    { id: 61, first_name: 'Kevin',   last_name: 'Rivera',    age: 38, country: 'Germany' },
    { id: 62, first_name: 'Sarah',   last_name: 'Cooper',    age: 28, country: 'United Kingdom' },
    { id: 63, first_name: 'Thomas',  last_name: 'Richardson', age: 35, country: 'Canada' },
    { id: 64, first_name: 'Sarah',   last_name: 'Cox',       age: 27, country: 'Australia' },
    { id: 65, first_name: 'Kevin',   last_name: 'Howard',    age: 41, country: 'Mexico' },
    { id: 66, first_name: 'Sarah',   last_name: 'Ward',      age: 29, country: 'United States' },
    { id: 67, first_name: 'Thomas',  last_name: 'Torres',    age: 34, country: 'Brazil' },
    { id: 68, first_name: 'Sarah',   last_name: 'Peterson',  age: 26, country: 'France' },
    { id: 69, first_name: 'Lisa',    last_name: 'Gray',      age: 40, country: 'Japan' },
    { id: 70, first_name: 'Sarah',   last_name: 'Ramirez',   age: 23, country: 'India' },
    { id: 71, first_name: 'Kevin',   last_name: 'James',     age: 35, country: 'Germany' },
    { id: 72, first_name: 'Sarah',   last_name: 'Watson',    age: 28, country: 'United Kingdom' },
    { id: 73, first_name: 'Thomas',  last_name: 'Brooks',    age: 32, country: 'Canada' },
    { id: 74, first_name: 'Sarah',   last_name: 'Kelly',     age: 27, country: 'Australia' },
    { id: 75, first_name: 'Kevin',   last_name: 'Sanders',   age: 41, country: 'Mexico' },
    { id: 76, first_name: 'Sarah',   last_name: 'Price',     age: 29, country: 'United States' },
    { id: 77, first_name: 'Thomas',  last_name: 'Bennett',   age: 34, country: 'Brazil' },
    { id: 78, first_name: 'Sarah',   last_name: 'Wood',      age: 26, country: 'France' },
    { id: 79, first_name: 'Lisa',    last_name: 'Barnes',    age: 40, country: 'Japan' },
    { id: 80, first_name: 'Sarah',   last_name: 'Ross',      age: 23, country: 'India' },
    { id: 81, first_name: 'Kevin',   last_name: 'Henderson', age: 35, country: 'Germany' },
    { id: 82, first_name: 'Sarah',   last_name: 'Coleman',   age: 28, country: 'United Kingdom' },
    { id: 83, first_name: 'Thomas',  last_name: 'Jenkins',   age: 32, country: 'Canada' },
    { id: 84, first_name: 'Sarah',   last_name: 'Perry',     age: 27, country: 'Australia' },
    { id: 85, first_name: 'Kevin',   last_name: 'Powell',    age: 41, country: 'Mexico' },
    { id: 86, first_name: 'Sarah',   last_name: 'Long',      age: 29, country: 'United States' },
    { id: 87, first_name: 'Thomas',  last_name: 'Patterson', age: 34, country: 'Brazil' },
    { id: 88, first_name: 'Sarah',   last_name: 'Hughes',    age: 26, country: 'France' },
    { id: 89, first_name: 'Lisa',    last_name: 'Flores',    age: 40, country: 'Japan' },
    { id: 90, first_name: 'Sarah',   last_name: 'Washington',age: 23, country: 'India' },
    { id: 91, first_name: 'Kevin',   last_name: 'Butler',    age: 35, country: 'Germany' },
    { id: 92, first_name: 'Sarah',   last_name: 'Simmons',   age: 28, country: 'United Kingdom' },
    { id: 93, first_name: 'Thomas',  last_name: 'Foster',    age: 32, country: 'Canada' },
    { id: 94, first_name: 'Sarah',   last_name: 'Gonzales',  age: 27, country: 'Australia' },
    { id: 95, first_name: 'Kevin',   last_name: 'Bryant',    age: 41, country: 'Mexico' },
    { id: 96, first_name: 'Sarah',   last_name: 'Alexander', age: 29, country: 'United States' },
    { id: 97, first_name: 'Thomas',  last_name: 'Russell',   age: 34, country: 'Brazil' },
    { id: 98, first_name: 'Sarah',   last_name: 'Griffin',   age: 26, country: 'France' },
    { id: 99, first_name: 'Lisa',    last_name: 'Diaz',      age: 40, country: 'Japan' },
    { id: 100, first_name: 'Sarah',  last_name: 'Hayes',     age: 23, country: 'India' },
    { id: 101, first_name: 'Kevin',  last_name: 'Myers',     age: 35, country: 'Germany' },
    { id: 102, first_name: 'Sarah',  last_name: 'Ford',      age: 28, country: 'United Kingdom' },
    { id: 103, first_name: 'Thomas', last_name: 'Hamilton',  age: 32, country: 'Canada' },
    { id: 104, first_name: 'Sarah',  last_name: 'Graham',    age: 27, country: 'Australia' },
    { id: 105, first_name: 'Kevin',  last_name: 'Sullivan',  age: 41, country: 'Mexico' },
    { id: 106, first_name: 'Sarah',  last_name: 'Wallace',   age: 29, country: 'United States' },
    { id: 107, first_name: 'Thomas', last_name: 'Woods',     age: 34, country: 'Brazil' },
    { id: 108, first_name: 'Sarah',  last_name: 'Cole',      age: 26, country: 'France' },
    { id: 109, first_name: 'Lisa',   last_name: 'West',      age: 40, country: 'Japan' },
    { id: 110, first_name: 'Sarah',  last_name: 'Jordan',    age: 23, country: 'India' },
    { id: 111, first_name: 'Kevin',  last_name: 'Owens',     age: 35, country: 'Germany' },
    { id: 112, first_name: 'Sarah',  last_name: 'Reynolds',  age: 28, country: 'United Kingdom' },
    { id: 113, first_name: 'Thomas', last_name: 'Fisher',    age: 32, country: 'Canada' },
    { id: 114, first_name: 'Sarah',  last_name: 'Ellis',     age: 27, country: 'Australia' },
    { id: 115, first_name: 'Kevin',  last_name: 'Harrison',  age: 41, country: 'Mexico' },
    { id: 116, first_name: 'Sarah',  last_name: 'Gibson',    age: 29, country: 'United States' },
    { id: 117, first_name: 'Thomas', last_name: 'McDonald',  age: 34, country: 'Brazil' },
    { id: 118, first_name: 'Sarah',  last_name: 'Cruz',      age: 26, country: 'France' },
    { id: 119, first_name: 'Lisa',   last_name: 'Marshall',  age: 40, country: 'Japan' },
    { id: 120, first_name: 'Sarah',  last_name: 'Ortiz',     age: 23, country: 'India' },
    { id: 121, first_name: 'Kevin',  last_name: 'Samuel',    age: 35, country: 'Germany' },
    { id: 122, first_name: 'Sarah',  last_name: 'Gonzalez',  age: 28, country: 'United Kingdom' },
    { id: 123, first_name: 'Thomas', last_name: 'Davis',     age: 32, country: 'Canada' },
    { id: 124, first_name: 'Sarah',  last_name: 'Ramirez',   age: 27, country: 'Australia' },
    { id: 125, first_name: 'Kevin',  last_name: 'Robinson',  age: 41, country: 'Mexico' },
    { id: 126, first_name: 'Sarah',  last_name: 'Reed',      age: 29, country: 'United States' },
    { id: 127, first_name: 'Thomas', last_name: 'Patterson', age: 34, country: 'Brazil' },
    { id: 128, first_name: 'Sarah',  last_name: 'King',      age: 26, country: 'France' },
    { id: 129, first_name: 'Lisa',   last_name: 'Lopez',     age: 40, country: 'Japan' },
    { id: 130, first_name: 'Sarah',  last_name: 'Clark',     age: 23, country: 'India' },
    { id: 131, first_name: 'Kevin',  last_name: 'Hayes',     age: 35, country: 'Germany' },
    { id: 132, first_name: 'Sarah',  last_name: 'Ross',      age: 28, country: 'United Kingdom' },
    { id: 133, first_name: 'Thomas', last_name: 'Sanders',   age: 32, country: 'Canada' },
    { id: 134, first_name: 'Sarah',  last_name: 'Reynolds',  age: 27, country: 'Australia' },
    { id: 135, first_name: 'Kevin',  last_name: 'Alexander', age: 41, country: 'Mexico' },
    { id: 136, first_name: 'Sarah',  last_name: 'Black',     age: 29, country: 'United States' },
    { id: 137, first_name: 'Thomas', last_name: 'Perez',     age: 34, country: 'Brazil' },
    { id: 138, first_name: 'Sarah',  last_name: 'Coleman',   age: 26, country: 'France' },
    { id: 139, first_name: 'Lisa',   last_name: 'Reed',      age: 40, country: 'Japan' },
    { id: 140, first_name: 'Sarah',  last_name: 'Barnes',    age: 23, country: 'India' },
    { id: 141, first_name: 'Kevin',  last_name: 'Morrow',    age: 35, country: 'Germany' },
    { id: 142, first_name: 'Sarah',  last_name: 'Erickson',  age: 28, country: 'United Kingdom' },
    { id: 143, first_name: 'Thomas', last_name: 'Stevens',   age: 32, country: 'Canada' },
    { id: 144, first_name: 'Sarah',  last_name: 'Grant',     age: 27, country: 'Australia' },
    { id: 145, first_name: 'Kevin',  last_name: 'Glover',    age: 41, country: 'Mexico' },
    { id: 146, first_name: 'Sarah',  last_name: 'Allen',     age: 29, country: 'United States' },
    { id: 147, first_name: 'Thomas', last_name: 'Torres',    age: 34, country: 'Brazil' },
    { id: 148, first_name: 'Sarah',  last_name: 'Clark',     age: 26, country: 'France' },
    { id: 149, first_name: 'Lisa',   last_name: 'Ramirez',   age: 40, country: 'Japan' },
    { id: 150, first_name: 'Sarah',  last_name: 'Evans',     age: 23, country: 'India' },
    { id: 151, first_name: 'Kevin',  last_name: 'Craig',     age: 35, country: 'Germany' },
    { id: 152, first_name: 'Sarah',  last_name: 'Adams',     age: 28, country: 'United Kingdom' },
    { id: 153, first_name: 'Thomas', last_name: 'Morales',   age: 32, country: 'Canada' },
    { id: 154, first_name: 'Sarah',  last_name: 'Jacobs',    age: 27, country: 'Australia' },
    { id: 155, first_name: 'Kevin',  last_name: 'Mcdowell',  age: 41, country: 'Mexico' },
    { id: 156, first_name: 'Sarah',  last_name: 'Mayer',     age: 29, country: 'United States' },
    { id: 157, first_name: 'Thomas', last_name: 'Mendez',    age: 34, country: 'Brazil' },
    { id: 158, first_name: 'Sarah',  last_name: 'Turner',    age: 26, country: 'France' },
    { id: 159, first_name: 'Lisa',   last_name: 'Navarro',   age: 40, country: 'Japan' },
    { id: 160, first_name: 'Sarah',  last_name: 'Cline',     age: 23, country: 'India' },
    { id: 161, first_name: 'Kevin',  last_name: 'Riley',     age: 35, country: 'Germany' },
    { id: 162, first_name: 'Sarah',  last_name: 'Bennett',   age: 28, country: 'United Kingdom' },
    { id: 163, first_name: 'Thomas', last_name: 'Forbes',    age: 32, country: 'Canada' },
    { id: 164, first_name: 'Sarah',  last_name: 'Fry',       age: 27, country: 'Australia' },
    { id: 165, first_name: 'Kevin',  last_name: 'Reese',     age: 41, country: 'Mexico' },
    { id: 166, first_name: 'Sarah',  last_name: 'Swanson',   age: 29, country: 'United States' },
    { id: 167, first_name: 'Thomas', last_name: 'Benton',    age: 34, country: 'Brazil' },
    { id: 168, first_name: 'Sarah',  last_name: 'Vargas',    age: 26, country: 'France' },
    { id: 169, first_name: 'Lisa',   last_name: 'Conrad',    age: 40, country: 'Japan' },
    { id: 170, first_name: 'Sarah',  last_name: 'Gaines',    age: 23, country: 'India' },
    { id: 171, first_name: 'Kevin',  last_name: 'Hudson',    age: 35, country: 'Germany' },
    { id: 172, first_name: 'Sarah',  last_name: 'Ross',      age: 28, country: 'United Kingdom' },
    { id: 173, first_name: 'Thomas', last_name: 'Lucas',     age: 32, country: 'Canada' },
    { id: 174, first_name: 'Sarah',  last_name: 'Levy',      age: 27, country: 'Australia' },
    { id: 175, first_name: 'Kevin',  last_name: 'Fleming',   age: 41, country: 'Mexico' },
    { id: 176, first_name: 'Sarah',  last_name: 'Pope',      age: 29, country: 'United States' },
    { id: 177, first_name: 'Thomas', last_name: 'Stark',     age: 34, country: 'Brazil' },
    { id: 178, first_name: 'Sarah',  last_name: 'Nixon',     age: 26, country: 'France' },
    { id: 179, first_name: 'Lisa',   last_name: 'Bean',      age: 40, country: 'Japan' },
    { id: 180, first_name: 'Sarah',  last_name: 'Mclean',    age: 23, country: 'India' },
    { id: 181, first_name: 'Kevin',  last_name: 'Sharpe',    age: 35, country: 'Germany' },
    { id: 182, first_name: 'Sarah',  last_name: 'Casey',     age: 28, country: 'United Kingdom' },
    { id: 183, first_name: 'Thomas', last_name: 'Clarke',    age: 32, country: 'Canada' },
    { id: 184, first_name: 'Sarah',  last_name: 'Figueroa',  age: 27, country: 'Australia' },
    { id: 185, first_name: 'Kevin',  last_name: 'Pace',      age: 41, country: 'Mexico' },
    { id: 186, first_name: 'Sarah',  last_name: 'Maynard',   age: 29, country: 'United States' },
    { id: 187, first_name: 'Thomas', last_name: 'Mann',      age: 34, country: 'Brazil' },
    { id: 188, first_name: 'Sarah',  last_name: 'Gamble',    age: 26, country: 'France' },
    { id: 189, first_name: 'Lisa',   last_name: 'Duncan',    age: 40, country: 'Japan' },
    { id: 190, first_name: 'Sarah',  last_name: 'Hale',      age: 23, country: 'India' },
    { id: 191, first_name: 'Kevin',  last_name: 'Freeman',   age: 35, country: 'Germany' },
    { id: 192, first_name: 'Sarah',  last_name: 'Clarke',    age: 28, country: 'United Kingdom' },
    { id: 193, first_name: 'Thomas', last_name: 'Marsh',     age: 32, country: 'Canada' },
    { id: 194, first_name: 'Sarah',  last_name: 'Kent',      age: 27, country: 'Australia' },
    { id: 195, first_name: 'Kevin',  last_name: 'Chan',      age: 41, country: 'Mexico' },
    { id: 196, first_name: 'Sarah',  last_name: 'Warner',    age: 29, country: 'United States' },
    { id: 197, first_name: 'Thomas', last_name: 'Lucas',     age: 34, country: 'Brazil' },
    { id: 198, first_name: 'Sarah',  last_name: 'Potter',    age: 26, country: 'France' },
    { id: 199, first_name: 'Lisa',   last_name: 'Grimes',    age: 40, country: 'Japan' },
    { id: 200, first_name: 'Thomas', last_name: 'Vance',     age: 38, country: 'Germany' }
  ];

  // “Вшитые” данные для таблицы orders (10 записей)
  const ordersData = [
    { order_id:  1, customer: 'John',     total: 250.75 },
    { order_id:  2, customer: 'Emma',     total:  99.50 },
    { order_id:  3, customer: 'Michael',  total: 130.00 },
    { order_id:  4, customer: 'Olivia',   total: 180.25 },
    { order_id:  5, customer: 'William',  total: 300.00 },
    { order_id:  6, customer: 'Ava',      total:  45.00 },
    { order_id:  7, customer: 'James',    total:  80.00 },
    { order_id:  8, customer: 'Sophia',   total: 220.50 },
    { order_id:  9, customer: 'Benjamin', total: 150.00 },
    { order_id: 10, customer: 'Isabella', total: 275.75 }
  ];

  // ref для <input type="file">
  const fileInputRef = useRef(null);

  // При монтировании создаём таблицы people и orders
  useEffect(() => {
    try {
      // Удаляем старые таблицы, если они есть
      alasql('DROP TABLE IF EXISTS people;');
      alasql('DROP TABLE IF EXISTS orders;');

      // 1) Создаём таблицу people
      alasql(`
        CREATE TABLE people (
          id INT,
          first_name STRING,
          last_name STRING,
          age INT,
          country STRING
        );
      `);
      // Вставляем данные в people
      peopleData.forEach((row) => {
        alasql(
          'INSERT INTO people VALUES (?, ?, ?, ?, ?);',
          [row.id, row.first_name, row.last_name, row.age, row.country]
        );
      });

      // 2) Создаём таблицу orders
      alasql(`
        CREATE TABLE orders (
          order_id INT,
          customer STRING,
          total FLOAT
        );
      `);
      // Вставляем данные в orders
      ordersData.forEach((row) => {
        alasql(
          'INSERT INTO orders VALUES (?, ?, ?);',
          [row.order_id, row.customer, row.total]
        );
      });

      // Сначала показываем таблицу people
      const initialRows = alasql('SELECT * FROM people;');
      buildGrid(initialRows);
      setCurrentTableName('people');

      toast.success('Таблицы people и orders созданы', { position: 'bottom-center' });
    } catch (err) {
      console.error('Ошибка при создании таблиц:', err);
      toast.error('Не удалось инициализировать таблицы', { position: 'bottom-center' });
    }
  }, []);

  // Функция для построения DataGrid из массива объектов
  const buildGrid = (rowsArray) => {
    const rowsWithId = rowsArray.map((row, idx) => ({
      id: row.id ?? row.order_id ?? idx + 1,
      ...row
    }));
    setResultRows(rowsWithId);

    if (rowsWithId.length > 0) {
      const keys = Object.keys(rowsWithId[0]).filter((key) => key !== 'id');
      setColumns([
        { field: 'id', headerName: 'ID', width: 80 },
        ...keys.map((key) => ({
          field: key,
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
          flex: 1
        }))
      ]);
    } else {
      setColumns([{ field: 'id', headerName: 'ID', width: 80 }]);
    }
  };

  // При изменении queryText выполняем SQL
  useEffect(() => {
    if (!queryText || !queryText.trim()) {
      // Если поле пустое, показываем people
      try {
        const rows = alasql('SELECT * FROM people;');
        buildGrid(rows);
        setCurrentTableName('people');
      } catch {}
      return;
    }

    try {
      const res = alasql(queryText.trim());

      if (Array.isArray(res)) {
        buildGrid(res);
        const match = queryText.match(/FROM\s+([^\s;]+)/i);
        if (match) {
          setCurrentTableName(match[1]);
        }
      } else {
        // Если это CREATE/INSERT/UPDATE/DELETE, показываем people
        const rows = alasql('SELECT * FROM people;');
        buildGrid(rows);
        setCurrentTableName('people');
      }

      toast.success('Запрос выполнен', { position: 'bottom-center' });
    } catch (err) {
      console.error('Ошибка в SQL:', err);
      toast.error(`Ошибка в SQL: ${err.message}`, { position: 'bottom-center' });
      try {
        const rows = alasql('SELECT * FROM people;');
        buildGrid(rows);
        setCurrentTableName('people');
      } catch {}
    }
  }, [queryText]);

  // Обработчик для кнопки “Импорт таблицы”
  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  // При выборе файла читаем CSV и создаём новую таблицу
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;
        if (!data.length) {
          toast.error('CSV пуст или не удалось распознать', { position: 'bottom-center' });
          return;
        }

        // Запросим у пользователя имя таблицы
        let tableName = prompt('Введите имя новой таблицы (латиницей, без пробелов)');
        if (!tableName) {
          toast.error('Имя таблицы не указано', { position: 'bottom-center' });
          return;
        }
        tableName = tableName.trim().replace(/\s+/g, '_');

        // Формируем схему: все поля STRING
        const columnsList = Object.keys(data[0]);
        const schema = columnsList.map((col) => `${col} STRING`).join(', ');

        try {
          // Удаляем, если уже есть таблица с таким именем
          alasql(`DROP TABLE IF EXISTS ${tableName};`);

          // Создаём таблицу
          alasql(`CREATE TABLE ${tableName} (${schema});`);

          // Вставляем каждую строку
          data.forEach((row) => {
            const values = columnsList.map((col) => row[col]);
            const placeholders = columnsList.map(() => '?').join(', ');
            alasql(
              `INSERT INTO ${tableName} VALUES (${placeholders});`,
              values
            );
          });

          // Отобразим новую таблицу
          const newRows = alasql(`SELECT * FROM ${tableName};`);
          buildGrid(newRows);
          setCurrentTableName(tableName);

          toast.success(`Таблица ${tableName} импортирована`, { position: 'bottom-center' });
        } catch (err) {
          console.error('Ошибка при импорте таблицы:', err);
          toast.error('Не удалось импортировать таблицу', { position: 'bottom-center' });
        }
      },
      error: (err) => {
        console.error('Ошибка при чтении CSV:', err);
        toast.error('Не удалось прочитать CSV', { position: 'bottom-center' });
      }
    });

    // Сбросим input, чтобы при повторном выборе того же файла событие сработало
    e.target.value = '';
  };

  // Обработчик для кнопки “Экспорт таблицы в CSV”
  const handleExportClick = () => {
    if (!resultRows.length) {
      toast.error('Таблица пуста, нечего экспортировать', { position: 'bottom-center' });
      return;
    }

    // Используем Papa.unparse для конвертации JSON → CSV
    const csvString = Papa.unparse(resultRows);
    const blob = new Blob([csvString], { type: 'text/csv;charset=UTF-8;' });

    // Формируем ссылку и скачиваем
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    // Имя файла: <название_таблицы>_export.csv
    link.setAttribute('download', `${currentTableName || 'table'}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Таблица ${currentTableName} экспортирована`, { position: 'bottom-center' });
  };

  return (
    <div style={{ height: 600, width: '100%', marginTop: '20px' }}>
      {/* Верхняя панель: название таблицы, кнопки “Импорт” и “Экспорт” */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
        <Typography variant="h6">{currentTableName}</Typography>

        <Button variant="contained" onClick={handleImportClick}>
          Импортировать таблицу
        </Button>

        <Button variant="outlined" onClick={handleExportClick}>
          Экспортировать таблицу
        </Button>

        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      <DataGrid
        rows={resultRows}
        columns={columns}
        getRowId={(row) => row.id}
        disableSelectionOnClick
      />

      <Toaster />
    </div>
  );
}

export default Result;
