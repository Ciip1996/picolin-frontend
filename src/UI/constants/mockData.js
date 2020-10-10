// @flow
import axios from 'axios';

export const user = {
  id: 0,
  names: 'Jonathan',
  initials: 'JDR'
};
export const Urls = {
  sales: 'https://5ea7234084f6290016ba7c3e.mockapi.io/sales',
  states: 'https://5ea7234084f6290016ba7c3e.mockapi.io/states',
  industry: 'https://5ea7234084f6290016ba7c3e.mockapi.io/industy',
  feeAgreement: 'https://5ea7234084f6290016ba7c3e.mockapi.io/feeAgreements',
  roster: 'https://5ea7234084f6290016ba7c3e.mockapi.io/roster'
};

// Create instance API axios
export const mockAPI = (url: string) => {
  return axios.get(`${url && url}`);
};

export const userExample = 'Ayuwoki Gonzáles';

export const loremIpsum =
  'Lorem ipsum dolor sit amet, 33. 3 % consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam, quis nostrud exercitation;ur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation';

export const fileViewLabels = [
  {
    id: 1,
    bulkId: 'MKWWW846468',
    subject: 'Hi',
    message: loremIpsum,
    time: '12:54',
    isActiveCard: true
  },
  { id: 2, bulkId: 'BK846468', subject: 'Hi BRASILW', message: loremIpsum, time: '12:54' },
  { id: 3, bulkId: 'WW8F462358', subject: 'Dear Nigga friend', message: loremIpsum, time: '12:54' },
  {
    id: 4,
    bulkId: 'SOAOW846468',
    subject: 'Recruiter message',
    message: loremIpsum,
    time: '12:54'
  },
  { id: 5, bulkId: 'APOSOW84468', subject: 'Get to know', message: loremIpsum, time: '12:54' },
  { id: 6, bulkId: 'QUWUW84998', subject: 'Blah Blah no ', message: loremIpsum, time: '12:54' },
  { id: 7, bulkId: 'SIID6435468', subject: 'Hello', message: loremIpsum, time: '12:54' },
  { id: 8, bulkId: 'SOEOW147968', subject: 'Bella Chiao', message: loremIpsum, time: '12:54' },
  { id: 9, bulkId: 'ORORW987768', subject: 'New Message', message: loremIpsum, time: '12:54' },
  { id: 10, bulkId: 'LOFKW687468', subject: 'Hi', message: loremIpsum, time: '12:54' }
];

export const Names = {
  userpersona1: {
    contactName: 'Ayuwoki Gonzáles',
    acron: 'MKL',
    time: '11:30',
    color: 'tomato'
  },
  userpersona2: {
    contactName: 'Paulo Wuanchope',
    acron: 'LUY',
    time: '8:30',
    color: 'deepskyblue'
  },
  userpersona3: {
    contactName: 'Roberto Firmino',
    acron: 'MXS',
    time: '10:10',
    color: 'hotpink'
  },
  userpersona4: {
    contactName: 'Hachita Ludueña',
    acron: 'KQL',
    time: '17:30',
    color: 'darkcyan'
  },
  userpersona5: {
    contactName: 'Carlitos Tevez',
    acron: 'PSJ',
    time: '6:30',
    color: 'darkorange'
  },
  userpersona6: {
    contactName: 'Rivaldo',
    acron: 'NBB',
    time: '17:30',
    color: 'lightblue'
  },
  userpersona7: {
    contactName: 'Diego Forlán',
    acron: 'DLF',
    time: '1:30',
    color: 'peru'
  },
  userpersona8: {
    contactName: 'Diego Armando Maradona',
    acron: 'LKS',
    time: '7:30',
    color: 'deepskyblue'
  },
  userpersona9: {
    contactName: 'Jürgen Klinsmann',
    acron: 'GXL',
    time: '5:30',
    color: 'turquoise'
  },
  userpersona10: {
    contactName: 'Pony Ruiz',
    acron: 'MKL',
    time: '17:30',
    color: 'navy'
  }
};

export const callsLabels = [
  {
    id: 1,
    ...Names.userpersona1,
    numberOrExtension: '(605) 937-5918 ',
    callType: 'missedCall',
    currentRow: 0
  },
  {
    id: 2,
    ...Names.userpersona2,
    numberOrExtension: '(605) 937-5918 ',
    callType: 'outBound',
    currentRow: 1
  },
  {
    id: 3,
    ...Names.userpersona3,
    numberOrExtension: '(605) 937-5918 ',
    callType: 'outBound',

    currentRow: 2
  },
  {
    id: 4,
    ...Names.userpersona4,
    numberOrExtension: '(605) 937-5918 ',
    callType: 'missedCall'
  },
  {
    id: 5,
    ...Names.userpersona5,
    numberOrExtension: '(605) 937-5918 ',
    callType: 'missedCall'
  },
  {
    id: 6,
    ...Names.userpersona6,
    numberOrExtension: '(605) 937-5918 ',
    callType: 'missedCall'
  },
  {
    id: 7,
    ...Names.userpersona7,
    numberOrExtension: '(605) 937-5918 ',
    callType: 'inbound'
  },
  {
    id: 8,
    ...Names.userpersona8,
    numberOrExtension: '(605) 937-5918 ',
    callType: 'outBound'
  },
  {
    id: 9,
    ...Names.userpersona9,
    numberOrExtension: '(605) 937-5918 ',
    callType: 'inbound'
  },
  {
    id: 10,
    ...Names.userpersona10,
    numberOrExtension: '(605) 937-5918 ',
    callType: 'outBound'
  }
];

const mesage = loremIpsum;

export const smsLabels = [
  {
    id: 1,
    ...Names.userpersona1,
    time: '10 minutes ago',
    mesage
  },
  {
    id: 2,
    ...Names.userpersona2,
    time: '20 minutes ago',
    mesage
  },
  {
    id: 3,
    ...Names.userpersona3,
    time: '1 hour ago',
    mesage
  },
  {
    id: 4,
    ...Names.userpersona4,
    mesage
  },
  {
    id: 5,
    ...Names.userpersona5,

    mesage
  },
  {
    id: 6,
    ...Names.userpersona6,
    mesage
  },
  {
    id: 7,
    ...Names.userpersona7,
    mesage
  },
  {
    id: 8,
    ...Names.userpersona8,
    mesage
  },
  {
    id: 9,
    ...Names.userpersona9,
    mesage
  },
  {
    id: 10,
    ...Names.userpersona10,
    mesage
  }
];

export const chatTextLabels = [
  {
    ...Names.userpersona1,
    mode: 'sender',
    message: 'Hello!'
  },
  {
    ...Names.userpersona5,
    mode: 'receiver',
    message: 'Good afternoon!'
  },
  {
    ...Names.userpersona1,
    mode: 'sender',
    message: 'How are you doing today?'
  },
  {
    ...Names.userpersona5,
    mode: 'receiver',
    message:
      'Fine blahblah blahbla mas blahblah amet, consectetur adipiscing elit. Pellentesque dignissim nunc vel eros blandit, vitae rhoncus tortor vestibulum. Suspendisse maximus ut neque eu lobortis. Donec interdum mi et sollicitudin porta. Vivamus tellus justo, sollicitudin quis laoreet vitae, suscipit at leo.'
  },
  {
    ...Names.userpersona1,
    mode: 'sender',
    message: 'Are you blah blah blah?'
  },
  {
    ...Names.userpersona5,
    mode: 'receiver',
    message: 'Of course my horse'
  }
];

const worldURL = 'images/world.svg';
const folderURL = 'images/folder.svg';

const myFolderURL = 'images/myFolders.svg';
const sharedURL = 'images/sharedItem.svg';
const privateURL = 'images/privateItem.svg';

export const treeViewFolders = [
  {
    id: 'GL',
    name: 'Global Templates',
    expanded: true,
    image: worldURL,
    subFolders: [
      {
        id: 'USA',
        name: 'marketing',
        image: folderURL,
        subFolders: [
          { id: 'CUB', name: '4th July', image: sharedURL },
          { id: 'MEX', name: 'Bulk Email', image: sharedURL }
        ]
      }
    ]
  },
  {
    id: 'Hoho',
    name: 'My Folders',
    image: myFolderURL,
    expanded: true,
    subFolders: [
      {
        id: 'NGA',
        name: 'My Private Folders',
        image: folderURL,
        expanded: true,
        subFolders: [
          { id: 'EGY', name: 'marketing', image: privateURL },
          { id: 'EGY', name: 'Resume', image: privateURL }
        ]
      },
      {
        id: 'NGA',
        name: 'Public Templates',
        image: folderURL,
        subFolders: [
          { id: 'EGY', name: 'Getting to know', image: privateURL },
          { id: 'EGY', name: 'Are you ...?', image: privateURL }
        ]
      }
    ]
  }
];
