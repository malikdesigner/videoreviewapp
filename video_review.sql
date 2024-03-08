-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 08, 2024 at 07:41 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `video_review`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_comments`
--

CREATE TABLE `tbl_comments` (
  `id` int(255) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `added_by` int(255) NOT NULL,
  `date_added` datetime(6) NOT NULL,
  `gameId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_comments`
--

INSERT INTO `tbl_comments` (`id`, `comment`, `added_by`, `date_added`, `gameId`) VALUES
(1, 'Amazing Game', 1, '2024-03-06 16:22:51.000000', 1),
(5, 'Excellent graphics of the game', 1, '2024-03-07 12:30:27.272000', 2),
(6, 'Much better than previous version', 1, '2024-03-07 12:32:51.148000', 2),
(7, 'Story is not worth it', 2, '2024-03-07 12:48:34.671000', 2),
(8, 'Game needs some update', 2, '2024-03-07 12:49:44.923000', 1),
(9, 'Better game', 2, '2024-03-07 12:52:31.476000', 3),
(10, 'Bugs needs to be fixed', 1, '2024-03-07 13:42:10.966000', 3),
(11, 'Excellent graphics', 1, '2024-03-07 13:42:28.026000', 3),
(13, 'Great experience ', 1, '2024-03-07 13:54:19.127000', 4),
(14, 'Thumbs up', 1, '2024-03-07 13:55:44.144000', 5),
(15, 'Excellent graphics ', 1, '2024-03-07 17:22:44.654000', 1),
(16, 'Good team game', 1, '2024-03-07 17:25:22.035000', 6),
(17, 'Excellent great graphics ', 2, '2024-03-07 17:27:29.686000', 6),
(20, 'Excellent team game', 2, '2024-03-07 17:38:50.553000', 7),
(21, 'Fix the bugs ', 3, '2024-03-07 17:49:27.327000', 4),
(23, 'Amazing Game', 1, '2024-03-08 15:18:48.349000', 8),
(25, 'Please fix the bugs', 4, '2024-03-08 15:27:38.219000', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE `tbl_user` (
  `id` int(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` int(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `date_added` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`id`, `firstname`, `lastname`, `email`, `phone_number`, `password`, `role`, `date_added`) VALUES
(1, 'Hameed', 'Malik', 'hameed@gmail.com', 2147483647, 'Hameed', 'moderator', '2024-03-04 15:45:35.003000'),
(2, 'Peter', 'Parody', 'peter@gmail.com', 2147483647, 'Peter', 'reviewer', '2024-03-07 12:47:22.783000'),
(3, 'David', 'Malan', 'david@gmail.com', 2147483647, 'David', 'reviewer', '2024-03-07 17:48:54.717000'),
(4, 'Lampard', 'Micheal', 'lampard@gmail.com', 2147483647, 'Lampard', 'reviewer', '2024-03-08 15:27:02.573000');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_vide_games`
--

CREATE TABLE `tbl_vide_games` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `year` int(255) NOT NULL,
  `rating` float(65,1) NOT NULL,
  `image` longtext NOT NULL,
  `added_by` int(11) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `date_added` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_vide_games`
--

INSERT INTO `tbl_vide_games` (`id`, `name`, `year`, `rating`, `image`, `added_by`, `location`, `date_added`) VALUES
(1, 'Tekken 7', 2017, 4.2, 'https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Official_Tekken_7_Logo.jpg/220px-Official_Tekken_7_Logo.jpg', 1, '33.7817646|72.3621522', '2024-03-06 19:57:12'),
(2, 'Far cry 6', 2018, 3.4, 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ-1JQmmFGex9il7ac1CY1E8Na5di8idOCs-VpoO5-vBCw6jbwGV95LvwxOW_6onfIsBeCIhw', 1, '33.7817646|72.3621522', '2024-03-06 20:28:05'),
(3, 'Pubg', 2019, 3.2, 'https://akm-img-a-in.tosshub.com/businesstoday/images/story/201901/pub_660x450_010219045955.jpg?size=948:533', 2, '33.7817646|72.3621522', '2024-03-07 12:50:37'),
(4, 'Angry Bird', 2019, 4.0, 'https://www.angrybirds.com/wp-content/uploads/2022/05/optimized-ABCOM_202203_1000x1000_CharacterDimensio_Red_Classic.png', 1, '33.7817646|72.3621522', '2024-03-07 13:39:14'),
(5, 'Mortal Kombat', 2019, 4.0, 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Mortal_Kombat_Logo.svg/1200px-Mortal_Kombat_Logo.svg.png', 1, '33.7817646|72.3621522', '2024-03-07 13:43:11'),
(6, 'Clash of clans', 2015, 3.0, 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT-Lbl-qg0nJ0SizoqoUPch96M6FZCEYa6MPFS-NvSsBI4hjjyjrBlYgGNX6TcUW3M78-mZMA', 1, '33.7817639|72.3621399', '2024-03-07 17:24:28'),
(8, 'Call of duty', 2015, 2.5, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fstore.steampowered.com%2Fapp%2F1962663%2FCall_of_Duty_Warzone%2F&psig=AOvVaw0AZ2lWaLa8oVitav7UDg32&ust=1709919891987000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCLjfrJDa4oQDFQAAAAAdAAAAABAJ', 1, 'null|null', '2024-03-07 17:47:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_comments`
--
ALTER TABLE `tbl_comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_vide_games`
--
ALTER TABLE `tbl_vide_games`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_comments`
--
ALTER TABLE `tbl_comments`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_vide_games`
--
ALTER TABLE `tbl_vide_games`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
