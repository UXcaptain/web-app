// import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react';
// import { ActionIcon, Container, Group, Text } from '@mantine/core';
// import { MantineLogo } from '@mantinex/mantine-logo';
// import classes from './SiteFooter.module.css';

// const SiteFooter = () => {
//     return (
//         <div className="footer">

//     <nav className="container py-2 border-bottom footer">

//             <div className="">
//                 <ul>
//                 <li>
//                     <NavLink to="/terminos-condiciones">Términos y condiciones</NavLink>
//                 </li>
//                     <li>Site-Footer</li>
//                     <li>Item 3</li>
//                     <li>Item 4</li>
//                 </ul>
//             </div>

//             <div className="">
//                 <ul>
//                     <li>Item 5</li>
//                     <li>Item 6</li>
//                     <li>Item 7</li>
//                     <li>Item 8</li>
//                 </ul>
//             </div>
//             <div className="">
//                 <ul>
//                     <li>Item 9</li>
//                     <li>Item 10</li>
//                     <li>Item 11</li>
//                     <li>Item 12</li>
//                 </ul>
//             </div>
            
//     </nav>
// </div>
//     )
// }

// export default SiteFooter;

// const data = [
//   {
//     title: 'About',
//     links: [
//       { label: 'Términos y condiciones', link: '/terminos-condiciones' },
//       { label: 'Pricing', link: '#' },
//       { label: 'Support', link: '#' },
//       { label: 'Forums', link: '#' },
//     ],
//   },
//   {
//     title: 'Project',
//     links: [
//       { label: 'Contribute', link: '#' },
//       { label: 'Media assets', link: '#' },
//       { label: 'Changelog', link: '#' },
//       { label: 'Releases', link: '#' },
//     ],
//   },
//   {
//     title: 'Community',
//     links: [
//       { label: 'Join Discord', link: '#' },
//       { label: 'Follow on Twitter', link: '#' },
//       { label: 'Email newsletter', link: '#' },
//       { label: 'GitHub discussions', link: '#' },
//     ],
//   },
// ];

// const SiteFooter = () => {
       
      
//         return (
//           <footer className={classes.footer}>
//             <Container className={classes.inner}>
//               <div className={classes.logo}>
//                 {/* <MantineLogo size={30} /> */}
//                 <Text size="xs" c="dimmed" className={classes.description}>
//                   Build fully functional accessible web applications faster than ever
//                 </Text>
//               </div>
//               <div className={classes.groups}>{groups}</div>
//             </Container>
//             <Container className={classes.afterFooter}>
//               <Text c="dimmed" size="sm">
//                 © 2020 mantine.dev. All rights reserved.
//               </Text>
      
//               <Group gap={0} className={classes.social} justify="flex-end" wrap="nowrap">
//                 <ActionIcon size="lg" color="gray" variant="subtle">
//                   <IconBrandTwitter size={18} stroke={1.5} />
//                 </ActionIcon>
//                 <ActionIcon size="lg" color="gray" variant="subtle">
//                   <IconBrandYoutube size={18} stroke={1.5} />
//                 </ActionIcon>
//                 <ActionIcon size="lg" color="gray" variant="subtle">
//                   <IconBrandInstagram size={18} stroke={1.5} />
//                 </ActionIcon>
//               </Group>
//             </Container>
//           </footer>
//         );
//       }

// export default SiteFooter;