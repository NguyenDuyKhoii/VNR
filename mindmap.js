/**
 * VNR Web Application - Interactive Mindmap & Infographic JS Module
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DATA STORE FOR DETAILED NODE VIEW ---
    const nodeDetails = {
        'node-root': {
            title: 'Hành Trình Đổi Mới & Phát Triển',
            subtitle: 'Lãnh đạo của Đảng Cộng sản Việt Nam (1986 - Nay)',
            category: 'Tổng quan',
            desc: 'Tiến trình lịch sử hào hùng đưa Việt Nam từ một nước nghèo nàn, chịu bao vây cấm vận, trở thành một nền kinh tế năng động, hội nhập sâu rộng toàn cầu với quy mô GDP vượt mốc 400 tỷ USD.',
            bullets: [
                '<strong>Hai giai đoạn lớn:</strong> Giai đoạn chuyển đổi, thoát khủng hoảng (1986-1995) và giai đoạn đẩy mạnh CNH-HĐH & hội nhập quốc tế (1996-nay).',
                '<strong>Lý luận cốt lõi:</strong> Phát triển kinh tế thị trường định hướng XHCN, xây dựng nhà nước pháp quyền của dân, do dân, vì dân.',
                '<strong>Động lực phát triển:</strong> Lấy khoa học công nghệ, đổi mới sáng tạo, chuyển đổi số làm động lực then chốt; coi con người là trung tâm.'
            ],
            statLabel: 'Thời gian đổi mới',
            statValue: '40 năm (1986 - Nay)',
            statDesc: 'Tốc độ tăng trưởng trung bình đạt khoảng 6-7%/năm, thuộc nhóm cao nhất khu vực.',
            image: 'img/VN_buoc_chuyen_minh.jpg',
            imageCaption: 'Việt Nam chuyển mình mạnh mẽ trong kỷ nguyên phát triển số'
        },
        'node-branch1': {
            title: 'Giai Đoạn 1986 - 1995: Khởi Xướng & Đột Phá',
            subtitle: 'Thời kỳ phá thế bao vây cô lập & khởi động đổi mới',
            category: 'Lịch sử',
            desc: 'Thực hiện đường lối đổi mới của Đại hội VI và Đại hội VII, Việt Nam từng bước tháo gỡ rào cản bao cấp, bình thường hóa quan hệ ngoại giao với các nước lớn và chính thức gia nhập ASEAN năm 1995.',
            bullets: [
                '<strong>Xóa bỏ bao cấp:</strong> Chuyển sang nền kinh tế hàng hóa nhiều thành phần vận động theo cơ chế thị trường.',
                '<strong>Chống lạm phát phi mã:</strong> Kiềm chế thành công lạm phát từ mức 774,7% năm 1986 xuống còn hai con số.',
                '<strong>Mở rộng ngoại giao:</strong> Bình thường hóa quan hệ Việt - Trung (1991), Việt - Mỹ (1995), gia nhập ASEAN (1995).'
            ],
            statLabel: 'Tăng trưởng GDP trung bình',
            statValue: '8.2% (1991 - 1995)',
            statDesc: 'Nền kinh tế bước vào giai đoạn tăng trưởng nhanh, chấm dứt tình trạng thiếu hụt lương thực kéo dài.',
            image: 'img/tong-bi-thu-nguyen-van-linh-hay-tra-ve-cho-san-xu-56-1-1752508948.jpg',
            imageCaption: 'Tổng Bí thư Nguyễn Văn Linh tại Đại hội VI - Khởi động đổi mới'
        },
        'node-dh6': {
            title: 'Đại Hội VI (12/1986) - Đổi Mới Toàn Diện',
            subtitle: 'Đại hội mở đường lịch sử',
            category: 'Đại hội Đảng',
            desc: 'Trong bối cảnh đất nước khủng hoảng kinh tế vĩ mô trầm trọng, Đại hội VI đã dũng cảm nhìn thẳng vào sự thật, đánh giá đúng sự thật để đề ra đường lối đổi mới toàn diện đất nước.',
            bullets: [
                '<strong>Sai lầm được chỉ ra:</strong> Quan liêu bao cấp, duy ý chí, nóng vội trong cải tạo XHCN.',
                '<strong>Bài học:</strong> Quán triệt tư tưởng "Lấy dân làm gốc", tôn trọng quy luật khách quan.',
                '<strong>3 Chương trình kinh tế lớn:</strong> Chương trình lương thực - thực phẩm, hàng tiêu dùng và hàng xuất khẩu.'
            ],
            statLabel: 'Lạm phát năm 1986',
            statValue: '774.7%',
            statDesc: 'Lạm phát phi mã đẩy đời sống nhân dân vào cảnh vô cùng khó khăn trước đổi mới.',
            image: 'img/tong-bi-thu-nguyen-van-linh-hay-tra-ve-cho-san-xu-56-1-1752508948.jpg',
            imageCaption: 'Toàn cảnh Đại hội Đảng toàn quốc lần thứ VI'
        },
        'node-dh7': {
            title: 'Đại Hội VII (6/1991) - Cương Lĩnh 1991',
            subtitle: 'Thông qua Cương lĩnh xây dựng đất nước',
            category: 'Đại hội Đảng',
            desc: 'Họp trong bối cảnh Liên Xô và Đông Âu sụp đổ, Đại hội VII đã thông qua Cương lĩnh 1991 lịch sử, định hướng rõ con đường quá độ lên CNXH ở Việt Nam với 6 đặc trưng cơ bản.',
            bullets: [
                '<strong>Cương lĩnh 1991:</strong> Bản thiết kế lý luận nền tảng cho con đường đi lên CNXH của nước nhà.',
                '<strong>Ngoại giao đa phương:</strong> Đề ra phương châm "Việt Nam muốn là bạn với tất cả các nước".',
                '<strong>Hội nghị giữa nhiệm kỳ (1994):</strong> Chỉ ra 4 nguy cơ chiến lược và khẳng định xây dựng Nhà nước pháp quyền.'
            ],
            statLabel: 'Đặc trưng CNXH',
            statValue: '6 Đặc Trưng',
            statDesc: 'Các thuộc tính cốt lõi của xã hội XHCN do nhân dân lao động làm chủ.',
            image: 'img/nongducmanh.jpg',
            imageCaption: 'Đại hội VII bầu đồng chí Đỗ Mười làm Tổng Bí thư'
        },
        'node-branch2': {
            title: 'Giai Đoạn 1996 - 2010: Đẩy Mạnh CNH - HĐH',
            subtitle: 'Thời kỳ đẩy mạnh công nghiệp hóa đất nước',
            category: 'Lịch sử',
            desc: 'Chính thức chuyển sang thời kỳ đẩy mạnh CNH-HĐH đất nước. Việt Nam lần lượt gia nhập WTO năm 2006 và chính thức thoát khỏi nhóm nước nghèo kém phát triển năm 2008.',
            bullets: [
                '<strong>Đẩy mạnh CNH-HĐH:</strong> Đặt mục tiêu phấn đấu đưa Việt Nam cơ bản trở thành nước công nghiệp vào năm 2020.',
                '<strong>Gia nhập WTO (2006):</strong> Trở thành thành viên thứ 150, mở toang cánh cửa hội nhập kinh tế toàn cầu.',
                '<strong>Kinh tế tư nhân:</strong> Được thừa nhận là bộ phận cấu thành quan trọng; cho phép Đảng viên làm kinh tế tư nhân.'
            ],
            statLabel: 'Quy mô thu hút FDI 2010',
            statValue: '$19.88 Tỷ USD',
            statDesc: 'Dòng vốn đầu tư nước ngoài bùng nổ vượt bậc sau khi Việt Nam gia nhập WTO.',
            image: 'img/dhVIII.jpg',
            imageCaption: 'Toàn cảnh Đại hội VIII năm 1996 - Bước chuyển mình mới'
        },
        'node-dh8': {
            title: 'Đại Hội VIII (1996) - Bước Ngoặt CNH - HĐH',
            subtitle: 'Khởi động công nghiệp hóa, hiện đại hóa',
            category: 'Đại hội Đảng',
            desc: 'Đánh giá tiền đề chuẩn bị cơ bản đã hoàn thành, Đại hội VIII quyết định đưa nước ta bước vào thời kỳ mới - thời kỳ đẩy mạnh CNH-HĐH đất nước, hướng tới mốc lịch sử năm 2020.',
            bullets: [
                '<strong>Nhận định lịch sử:</strong> Đất nước đã thoát khỏi khủng hoảng kinh tế - xã hội.',
                '<strong>Động lực cốt lõi:</strong> Khoa học - công nghệ và giáo dục - đào tạo là quốc sách hàng đầu.',
                '<strong>Định hướng đầu tư:</strong> Lấy hiệu quả kinh tế - xã hội làm tiêu chuẩn cao nhất.'
            ],
            statLabel: 'Mục tiêu chiến lược',
            statValue: 'Mốc 2020',
            statDesc: 'Phấn đấu đưa nước ta cơ bản trở thành một nước công nghiệp hiện đại.',
            image: 'img/daiHoiVIII.jpg',
            imageCaption: 'Đoàn chủ tịch Đại hội VIII (năm 1996)'
        },
        'node-dh9': {
            title: 'Đại Hội IX (2001) - Lý Luận Kinh Tế Thị Trường',
            subtitle: 'Tháo gỡ rào cản tư duy lý luận',
            category: 'Đại hội Đảng',
            desc: 'Đột phá lớn về mặt lý luận của Đảng khi lần đầu tiên xác định rõ mô hình kinh tế tổng quát trong thời kỳ quá độ là: Nền kinh tế thị trường định hướng xã hội chủ nghĩa.',
            bullets: [
                '<strong>Kinh tế thị trường định hướng XHCN:</strong> Khẳng định kinh tế thị trường không phải sản phẩm riêng của tư bản chủ nghĩa.',
                '<strong>Kinh tế tri thức:</strong> Đưa khái niệm kinh tế tri thức vào văn kiện; chủ trương đi tắt đón đầu.',
                '<strong>Hội nhập kinh tế:</strong> Đề ra chủ trương chủ động và tích cực hội nhập kinh tế quốc tế sâu rộng.'
            ],
            statLabel: 'Khái niệm đột phá',
            statValue: 'Kinh tế tri thức',
            statDesc: 'Thực hiện công nghiệp hóa rút ngắn gắn liền với phát triển tri thức công nghệ.'
            // No image for this card to show that layout renders correctly even without image
        },
        'node-dh10': {
            title: 'Đại Hội X (2006) - Đảng Viên Làm Kinh Tế Tư Nhân',
            subtitle: 'Giải phóng sức sản xuất của khối tư nhân',
            category: 'Đại hội Đảng',
            desc: 'Đại hội X đánh dấu quyết sách lịch sử khi cho phép Đảng viên được làm kinh tế tư nhân, đập tan định kiến tư tưởng, khơi thông mọi nguồn lực trong xã hội để bứt phá thoát nghèo.',
            bullets: [
                '<strong>Quyết sách lịch sử:</strong> Cho phép Đảng viên làm kinh tế tư nhân (Nghị quyết Trung ương 6 khóa X).',
                '<strong>Tinh gọn bộ máy:</strong> Sáp nhập, rút gọn cơ cấu Chính phủ xuống còn 22 bộ và cơ quan ngang bộ.',
                '<strong>Gia nhập WTO (11/2006):</strong> Mở rộng thị trường xuất khẩu, đón nhận dòng vốn FDI khổng lồ.'
            ],
            statLabel: 'Thời điểm thoát nghèo',
            statValue: 'Năm 2008',
            statDesc: 'Việt Nam chính thức bước ra khỏi nhóm nước nghèo, kém phát triển, gia nhập nhóm nước có thu nhập trung bình thấp.',
            image: 'img/dhx.jpg',
            imageCaption: 'Đại biểu biểu quyết thông qua Nghị quyết Đại hội X'
        },
        'node-branch3': {
            title: 'Giai Đoạn 2011 - 2020: Phát Triển Bền Vững & Hội Nhập',
            subtitle: 'Hoàn thiện 3 đột phá chiến lược & FTA thế hệ mới',
            category: 'Lịch sử',
            desc: 'Thông qua Cương lĩnh bổ sung phát triển năm 2011. Đẩy mạnh tái cơ cấu kinh tế toàn diện và tham gia sâu vào các hiệp định thương mại tự do thế hệ mới như CPTPP, EVFTA.',
            bullets: [
                '<strong>3 Đột phá chiến lược:</strong> Thể chế kinh tế thị trường, Phát triển nguồn nhân lực chất lượng cao, Xây dựng hạ tầng đồng bộ.',
                '<strong>Kinh tế tư nhân là động lực:</strong> Nghị quyết 10-NQ/TW năm 2017 nâng tầm khối tư nhân.',
                '<strong>Chống tham nhũng:</strong> Ban hành Nghị quyết TW 4 khóa XII, đẩy mạnh xây dựng chỉnh đốn Đảng quyết liệt.'
            ],
            statLabel: 'Đặc trưng Cương lĩnh 2011',
            statValue: '8 Đặc Trưng',
            statDesc: 'Bổ sung và phát triển lý luận từ Cương lĩnh 1991 phù hợp với thực tiễn thời đại mới.',
            image: 'img/dai-hoi-xi.jpg',
            imageCaption: 'Đại hội XI - Dấu ấn của các đột phá chiến lược'
        },
        'node-dh11': {
            title: 'Đại Hội XI (2011) - Cương Lĩnh 2011 & 3 Đột Phá',
            subtitle: 'Định hình mô hình phát triển bền vững',
            category: 'Đại hội Đảng',
            desc: 'Thông qua Cương lĩnh 2011 (bổ sung, phát triển). Xác định 3 đột phá chiến lược làm kim chỉ nam giải quyết các điểm nghẽn của đất nước để vượt qua bẫy thu nhập trung bình.',
            bullets: [
                '<strong>3 Đột phá chiến lược:</strong> Thể chế - Nhân lực - Hạ tầng (đặc biệt là hạ tầng giao thông cao tốc).',
                '<strong>Tái cơ cấu kinh tế:</strong> Tập trung vào đầu tư công, hệ thống ngân hàng thương mại, và các Tập đoàn kinh tế Nhà nước.',
                '<strong>Bổ sung đặc trưng:</strong> Xác định rõ nước ta có 8 đặc trưng của xã hội XHCN.'
            ],
            statLabel: 'Trọng tâm đột phá',
            statValue: 'Thể chế - Nhân lực - Hạ tầng',
            statDesc: 'Tập trung tháo gỡ điểm nghẽn, tạo động lực phát triển mới.'
        },
        'node-dh12': {
            title: 'Đại Hội XII (2016) - Động Lực Từ Khối Tư Nhân',
            subtitle: 'Kinh tế tư nhân và phòng chống tham nhũng quyết liệt',
            category: 'Đại hội Đảng',
            desc: 'Khẳng định kinh tế tư nhân là một động lực quan trọng của nền kinh tế. Đồng thời, đẩy mạnh công tác xây dựng, chỉnh đốn Đảng, phòng chống tham nhũng không có vùng cấm.',
            bullets: [
                '<strong>Nghị quyết 10-NQ/TW (2017):</strong> Khẳng định vai trò động lực quan trọng của kinh tế tư nhân.',
                '<strong>Phòng chống tham nhũng:</strong> Quyết liệt xử lý các vụ án lớn, củng cố niềm tin vững chắc trong nhân dân.',
                '<strong>Ký kết FTA thế hệ mới:</strong> CPTPP, EVFTA, UKVFTA đưa Việt Nam hội nhập sâu vào chuỗi toàn cầu.'
            ],
            statLabel: 'Xóa bỏ thuế quan EVFTA',
            statValue: '99% Thuế Quan',
            statDesc: 'Lộ trình xóa bỏ thuế quan song phương mở cánh cửa rộng lớn xuất khẩu sang Liên minh Châu Âu EU.',
            image: 'img/dh_xiii.jpg',
            imageCaption: 'Toàn cảnh Đại hội Đảng lần thứ XII'
        },
        'node-branch4': {
            title: 'Giai Đoạn 2021 - 2045: Khát Vọng Tương Lai',
            subtitle: 'Kỷ nguyên vươn mình của dân tộc',
            category: 'Lịch sử',
            desc: 'Hướng tới kỷ niệm 100 năm thành lập Đảng (2030) và 100 năm thành lập nước (2045), Đại hội XIII đề ra tầm nhìn đưa Việt Nam trở thành nước phát triển, có thu nhập cao.',
            bullets: [
                '<strong>Mốc 2025:</strong> Nước đang phát triển, có công nghiệp theo hướng hiện đại, vượt qua mức thu nhập trung bình thấp.',
                '<strong>Mốc 2030:</strong> Nước đang phát triển, có công nghiệp hiện đại, thu nhập trung bình cao.',
                '<strong>Mốc 2045:</strong> Trở thành nước phát triển, thu nhập cao.'
            ],
            statLabel: 'Mục tiêu quy mô thu nhập',
            statValue: 'Thu nhập cao (2045)',
            statDesc: 'Khát vọng đưa Việt Nam sánh vai với các cường quốc năm châu về trình độ phát triển kinh tế.',
            image: 'img/dh_xiii_2.jpg',
            imageCaption: 'Các đại biểu bỏ phiếu bầu cử tại Đại hội XIII'
        },
        'node-dh13': {
            title: 'Đại Hội XIII (2021) - Tầm Nhìn 2030 - 2045',
            subtitle: 'Khơi dậy khát vọng phát triển phồn vinh',
            category: 'Đại hội Đảng',
            desc: 'Đề ra tầm nhìn chiến lược cụ thể theo hai mốc lịch sử 100 năm của dân tộc, định hướng đưa Việt Nam vững vàng vượt qua các thách thức toàn cầu để bứt phá.',
            bullets: [
                '<strong>Khát vọng phát triển:</strong> Đưa khát vọng phát triển phồn vinh, hạnh phúc làm động lực tinh thần cho toàn dân tộc.',
                '<strong>6 Nhiệm vụ trọng tâm:</strong> Tiếp tục chỉnh đốn Đảng; Đẩy lùi tham nhũng; Phát triển văn hóa xã hội; Quốc phòng an ninh vững chắc...',
                '<strong>Chuyển đổi số:</strong> Đẩy mạnh chuyển đổi số quốc gia, phát triển kinh tế số, xã hội số.'
            ],
            statLabel: 'Mốc 100 năm lập nước',
            statValue: 'Năm 2045',
            statDesc: 'Mục tiêu trở thành nước phát triển, thu nhập cao.'
        },
        'node-branch5': {
            title: 'Tổng Kết Lịch Sử: Thành Tựu & Bài Học',
            subtitle: 'Nhìn lại chặng đường vẻ vang của công cuộc đổi mới',
            category: 'Tổng kết',
            desc: 'Thành tựu to lớn và có ý nghĩa lịch sử của công cuộc Đổi mới chứng minh đường lối phát triển đúng đắn của Đảng. Đồng thời đúc rút ra 5 bài học quý báu làm kim chỉ nam.',
            bullets: [
                '<strong>Cơ đồ đất nước:</strong> "Đất nước ta chưa bao giờ có được cơ đồ, tiềm lực, vị thế và uy tín quốc tế như ngày nay".',
                '<strong>Lấy dân làm gốc:</strong> Dân là gốc rễ, mọi quyết sách phải xuất phát từ lợi ích và nguyện vọng chính đáng của nhân dân.',
                '<strong>Xây dựng Đảng:</strong> Xây dựng Đảng trong sạch, vững mạnh là nhân tố quyết định mọi thắng lợi.'
            ],
            statLabel: 'Tỷ lệ nghèo đa chiều 2020',
            statValue: 'Dưới 3%',
            statDesc: 'Việt Nam hoàn thành trước thời hạn nhiều Mục tiêu Thiên niên kỷ của Liên Hợp Quốc về xóa đói giảm nghèo.',
            image: 'img/modau.jpg',
            imageCaption: 'Đất nước gặt hái nhiều thành tựu vượt bậc trên mọi lĩnh vực'
        },
        'node-thanhtuu': {
            title: 'Thành Tựu To Lớn Sau 40 Năm Đổi Mới',
            subtitle: 'Tiềm lực, vị thế và uy tín quốc tế được nâng cao',
            category: 'Tổng kết',
            desc: 'Việt Nam đã chấm dứt hoàn toàn khủng hoảng kinh tế - xã hội, phát triển toàn diện cả về quy mô kinh tế, phúc lợi xã hội và vị thế ngoại giao quốc tế.',
            bullets: [
                '<strong>Kinh tế vĩ mô:</strong> Quy mô kinh tế tăng gấp nhiều lần, thu nhập bình quân đầu người tăng trưởng bền vững.',
                '<strong>Phúc lợi & Xóa nghèo:</strong> Tỷ lệ hộ nghèo giảm ấn tượng, độ bao phủ bảo hiểm y tế toàn dân đạt trên 90%.',
                '<strong>Vị thế ngoại giao:</strong> Thiết lập quan hệ đối tác chiến lược, đối tác toàn diện với tất cả các nước lớn; ký kết 17 FTA.'
            ],
            statLabel: 'Xếp hạng quy mô kinh tế',
            statValue: 'Top 35 Thế Giới',
            statDesc: 'Việt Nam vươn lên thành một mắt xích sản xuất quan trọng tại khu vực Đông Nam Á và Châu Á.'
        },
        'node-baihoc': {
            title: '5 Bài Học Kinh Nghiệm Cốt Lõi',
            subtitle: 'Bảo vật dẫn đường cho các thế hệ tương lai',
            category: 'Tổng kết',
            desc: 'Qua thực tiễn lãnh đạo đổi mới, Đảng Cộng sản Việt Nam đã đúc rút 5 bài học lớn có giá trị định hướng lâu dài cho sự nghiệp cách mạng.',
            bullets: [
                '<strong>1. Lấy dân làm gốc:</strong> Mọi công việc của Đảng và Nhà nước phải lấy lợi ích của nhân dân làm mục tiêu cao nhất.',
                '<strong>2. Kiên định mục tiêu độc lập dân tộc và CNXH:</strong> Vận dụng sáng tạo chủ nghĩa Mác-Lênin và tư tưởng Hồ Chí Minh.',
                '<strong>3. Đổi mới toàn diện, đồng bộ:</strong> Có bước đi phù hợp, tôn trọng quy luật khách quan, xuất phát từ thực tiễn.',
                '<strong>4. Khâu then chốt:</strong> Thường xuyên xây dựng, chỉnh đốn Đảng và hệ thống chính trị trong sạch, vững mạnh.',
                '<strong>5. Kết hợp nội lực và ngoại lực:</strong> Phát huy sức mạnh dân tộc kết hợp sức mạnh thời đại phù hợp bối cảnh thế giới.'
            ],
            statLabel: 'Nhân tố quyết định thắng lợi',
            statValue: 'Sự lãnh đạo của Đảng',
            statDesc: 'Xây dựng Đảng trong sạch, nâng cao năng lực cầm quyền là then chốt của then chốt.'
        }
    };

    // --- 2. TAB SWITCHING LOGIC ---
    const tabButtons = document.querySelectorAll('.mindmap-tab-btn');
    const tabPanels = document.querySelectorAll('.mindmap-tab-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Toggle active buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle active panels
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetTab) {
                    panel.classList.add('active');
                }
            });

            // Redraw connections immediately if switching to mindmap tab (as element width/height are calculated correctly now)
            if (targetTab === 'sodohoc-tab') {
                setTimeout(() => {
                    resetZoom();
                    drawConnectors();
                }, 100);
            }
        });
    });

    // --- 3. MINDMAP ZOOM & PAN LOGIC ---
    const viewport = document.getElementById('mindmapViewport');
    const container = document.getElementById('mindmapContainer');
    const tree = document.querySelector('.mindmap-tree');

    let scale = 0.75;
    let translateX = 0;
    let translateY = 0;

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    function updateTransform() {
        if (!viewport) return;
        const viewportWidth = viewport.clientWidth;
        const viewportHeight = viewport.clientHeight;
        
        // Bounds calculation: prevent dragging the 2500px canvas completely out of sight.
        // Keep at least 250px of the canvas width and 200px of height visible.
        const minX = -2500 * scale + 250;
        const maxX = viewportWidth - 250;
        const minY = -2500 * scale + 200;
        const maxY = viewportHeight - 200;

        translateX = Math.min(maxX, Math.max(minX, translateX));
        translateY = Math.min(maxY, Math.max(minY, translateY));

        container.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    // Centering and reset function
    function resetZoom() {
        if (!viewport || !container) return;
        scale = 0.75;
        const viewportHeight = viewport.clientHeight;
        translateX = 40;
        // Tree Y center inside the 2500px canvas is around 1250px
        translateY = (viewportHeight / 2) - 1250 * scale;
        updateTransform();
    }

    // Mouse drag-to-pan handlers
    viewport.addEventListener('mousedown', (e) => {
        // Prevent panning when clicking detailed toggle or nodes
        if (e.target.closest('.mindmap-node') || e.target.closest('.zoom-btn') || e.target.closest('.filter-tag') || e.target.closest('.mindmap-search-wrapper')) return;
        
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        viewport.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        if (viewport) viewport.style.cursor = 'grab';
    });

    viewport.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    // Helper function to calculate distance between two touches for pinch zoom
    function getTouchDistance(touch1, touch2) {
        return Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
    }

    // Touch Drag & Pinch Zoom for Mindmap on mobile
    let initTouchDist = 0;
    let initScale = 1.0;

    viewport.addEventListener('touchstart', (e) => {
        if (e.target.closest('.mindmap-node') || e.target.closest('.zoom-btn') || e.target.closest('.filter-tag') || e.target.closest('.mindmap-search-wrapper') || e.target.closest('.node-toggle')) return;
        
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
        } else if (e.touches.length === 2) {
            isDragging = false;
            initTouchDist = getTouchDistance(e.touches[0], e.touches[1]);
            initScale = scale;
        }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && isDragging) {
            e.preventDefault(); // Prevent body scroll when dragging mindmap
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;
            updateTransform();
        } else if (e.touches.length === 2 && initTouchDist > 0) {
            e.preventDefault(); // Prevent default zoom behavior
            const currentDist = getTouchDistance(e.touches[0], e.touches[1]);
            const zoomFactor = currentDist / initTouchDist;
            
            const oldScale = scale;
            scale = Math.min(1.8, Math.max(0.5, initScale * zoomFactor));
            
            // Zoom center is the midpoint between fingers
            const rect = viewport.getBoundingClientRect();
            const touchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
            const touchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
            
            translateX = touchCenterX - (touchCenterX - translateX) * (scale / oldScale);
            translateY = touchCenterY - (touchCenterY - translateY) * (scale / oldScale);
            
            updateTransform();
        }
    }, { passive: false });

    viewport.addEventListener('touchend', () => {
        isDragging = false;
        initTouchDist = 0;
    });

    // Wheel zoom handler (Zoom on mouse cursor position)
    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = 1.08;
        const oldScale = scale;
        
        if (e.deltaY < 0) {
            scale = Math.min(1.8, scale * zoomFactor);
        } else {
            scale = Math.max(0.5, scale / zoomFactor);
        }
        
        const rect = viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        translateX = mouseX - (mouseX - translateX) * (scale / oldScale);
        translateY = mouseY - (mouseY - translateY) * (scale / oldScale);
        
        updateTransform();
    }, { passive: false });

    // Floating toolbar zoom button events
    document.getElementById('zoomIn').addEventListener('click', () => {
        const oldScale = scale;
        scale = Math.min(1.8, scale * 1.15);
        const centerViewX = viewport.clientWidth / 2;
        const centerViewY = viewport.clientHeight / 2;
        translateX = centerViewX - (centerViewX - translateX) * (scale / oldScale);
        translateY = centerViewY - (centerViewY - translateY) * (scale / oldScale);
        updateTransform();
    });

    document.getElementById('zoomOut').addEventListener('click', () => {
        const oldScale = scale;
        scale = Math.max(0.5, scale / 1.15);
        const centerViewX = viewport.clientWidth / 2;
        const centerViewY = viewport.clientHeight / 2;
        translateX = centerViewX - (centerViewX - translateX) * (scale / oldScale);
        translateY = centerViewY - (centerViewY - translateY) * (scale / oldScale);
        updateTransform();
    });

    document.getElementById('zoomReset').addEventListener('click', () => {
        resetZoom();
        drawConnectors();
    });

    // Fullscreen Viewport Toggle
    const fullscreenBtn = document.getElementById('zoomFullscreen');
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            viewport.requestFullscreen().then(() => {
                fullscreenBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
                setTimeout(() => {
                    resetZoom();
                    drawConnectors();
                }, 150);
            }).catch(err => {
                console.error("Lỗi khi mở toàn màn hình:", err);
            });
        } else {
            document.exitFullscreen();
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            setTimeout(() => {
                resetZoom();
                drawConnectors();
            }, 150);
        }
    });


    // --- 4. DYNAMIC CONNECTOR RENDERING (SVG CURVES) ---
    const svgCanvas = document.getElementById('mindmapSvg');

    function drawConnectors() {
        if (!svgCanvas || !container) return;
        
        svgCanvas.innerHTML = '';
        const containerRect = container.getBoundingClientRect();
        
        const rootNode = document.getElementById('node-root');
        if (!rootNode) return;
        
        const s = scale || 1; // Division scaling factor to convert screen coordinates back to local coordinates
        
        const branchGroups = document.querySelectorAll('.mindmap-branch-group');
        
        branchGroups.forEach(group => {
            const branch = group.querySelector('.mindmap-branch');
            if (!branch) return;
            
            // Check if branch node is hidden or muted
            const isBranchMuted = branch.classList.contains('muted-node');
            
            // 1. Draw connection from Root to Branch
            const rootRect = rootNode.getBoundingClientRect();
            const branchRect = branch.getBoundingClientRect();
            
            const startX = (rootRect.right - containerRect.left) / s;
            const startY = ((rootRect.top + rootRect.height / 2) - containerRect.top) / s;
            
            const endX = (branchRect.left - containerRect.left) / s;
            const endY = ((branchRect.top + branchRect.height / 2) - containerRect.top) / s;
            
            // SVG Cubic Bezier Curve Math
            const dx = endX - startX;
            const ctrlX1 = startX + dx * 0.45;
            const ctrlY1 = startY;
            const ctrlX2 = startX + dx * 0.55;
            const ctrlY2 = endY;
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M ${startX} ${startY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${endX} ${endY}`);
            
            // Add visual helper classes
            if (isBranchMuted) {
                path.classList.add('muted');
            } else if (branch.classList.contains('search-match') || rootNode.classList.contains('search-match')) {
                path.classList.add('glow');
            }
            
            svgCanvas.appendChild(path);
            
            // 2. Draw connections from Branch to visible Leaf nodes
            const leavesContainer = group.querySelector('.mindmap-leaves');
            const leaves = group.querySelectorAll('.mindmap-leaf');
            
            // Skip if collapsed or leaves hidden
            if (group.classList.contains('collapsed') || !leaves.length) return;
            
            leaves.forEach(leaf => {
                // Skip invisible leaf nodes
                const leafRect = leaf.getBoundingClientRect();
                if (leafRect.width === 0) return;
                
                const isLeafMuted = leaf.classList.contains('muted-node');
                
                const leafStartX = (branchRect.right - containerRect.left) / s;
                const leafStartY = ((branchRect.top + branchRect.height / 2) - containerRect.top) / s;
                
                const leafEndX = (leafRect.left - containerRect.left) / s;
                const leafEndY = ((leafRect.top + leafRect.height / 2) - containerRect.top) / s;
                
                const leafDx = leafEndX - leafStartX;
                const leafCtrlX1 = leafStartX + leafDx * 0.45;
                const leafCtrlY1 = leafStartY;
                const leafCtrlX2 = leafStartX + leafDx * 0.55;
                const leafCtrlY2 = leafEndY;
                
                const leafPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                leafPath.setAttribute('d', `M ${leafStartX} ${leafStartY} C ${leafCtrlX1} ${leafCtrlY1}, ${leafCtrlX2} ${leafCtrlY2}, ${leafEndX} ${leafEndY}`);
                
                if (isBranchMuted || isLeafMuted) {
                    leafPath.classList.add('muted');
                } else if (leaf.classList.contains('search-match') || branch.classList.contains('search-match')) {
                    leafPath.classList.add('glow');
                }
                
                svgCanvas.appendChild(leafPath);
            });
        });
    }

    // Initial setup and redraw on resize
    setTimeout(() => {
        resetZoom();
        drawConnectors();
    }, 200);
    window.addEventListener('resize', drawConnectors);


    // --- 5. BRANCH COLLAPSE / EXPAND TOGGLE ---
    const toggleButtons = document.querySelectorAll('.node-toggle');

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering node details panel
            const branchGroup = btn.closest('.mindmap-branch-group');
            if (branchGroup) {
                branchGroup.classList.toggle('collapsed');
                // Redraw SVG connectors after state transitions
                setTimeout(drawConnectors, 50);
            }
        });
    });


    // --- 6. SEARCH & TEXT FILTERING ---
    const searchInput = document.getElementById('mindmapSearch');
    const nodes = document.querySelectorAll('.mindmap-node');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query === '') {
            // Reset all nodes
            nodes.forEach(node => {
                node.classList.remove('search-match', 'muted-node');
            });
            drawConnectors();
            return;
        }

        nodes.forEach(node => {
            const title = node.querySelector('.node-title')?.textContent.toLowerCase() || '';
            const desc = node.querySelector('.node-desc')?.textContent.toLowerCase() || '';
            const tag = node.querySelector('.node-tag')?.textContent.toLowerCase() || '';
            
            // Check if node content matches query
            const isMatch = title.includes(query) || desc.includes(query) || tag.includes(query);
            
            if (isMatch) {
                node.classList.add('search-match');
                node.classList.remove('muted-node');
                
                // If it is a leaf, automatically expand its parent branch group
                if (node.classList.contains('mindmap-leaf')) {
                    const branchGroup = node.closest('.mindmap-branch-group');
                    if (branchGroup) {
                        branchGroup.classList.remove('collapsed');
                    }
                }
            } else {
                node.classList.remove('search-match');
                node.classList.add('muted-node');
            }
        });

        // Redraw connectors with highlighted paths
        drawConnectors();
    });


    // --- 7. CATEGORY FILTER SYSTEM ---
    const filterTags = document.querySelectorAll('.filter-tag');

    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const category = tag.getAttribute('data-category');
            
            // Toggle active badge UI
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            if (category === 'all') {
                nodes.forEach(node => node.classList.remove('muted-node'));
                drawConnectors();
                return;
            }

            nodes.forEach(node => {
                const nodeCategory = node.getAttribute('data-category');
                
                // Root is general and always visible
                if (node.id === 'node-root') {
                    node.classList.remove('muted-node');
                    return;
                }
                
                if (nodeCategory === category) {
                    node.classList.remove('muted-node');
                    // Automatically expand parent if filtered item is leaf
                    if (node.classList.contains('mindmap-leaf')) {
                        const branchGroup = node.closest('.mindmap-branch-group');
                        if (branchGroup) {
                            branchGroup.classList.remove('collapsed');
                        }
                    }
                } else {
                    node.classList.add('muted-node');
                }
            });

            drawConnectors();
        });
    });


    // --- 8. DETAILED SIDE PANEL (SLIDE-IN CONTENT VIEWER) ---
    const detailPanel = document.getElementById('nodeDetailPanel');
    const closePanelBtn = document.getElementById('panelClose');
    
    // Panel content references
    const panelCategory = document.getElementById('panelCategory');
    const panelTitle = document.getElementById('panelTitle');
    const panelSubtitle = document.getElementById('panelSubtitle');
    const panelDesc = document.getElementById('panelDesc');
    const panelBullets = document.getElementById('panelBullets');
    const panelStatLabel = document.getElementById('panelStatLabel');
    const panelStatValue = document.getElementById('panelStatValue');
    const panelStatDesc = document.getElementById('panelStatDesc');
    const panelImageWrapper = document.getElementById('panelImageWrapper');
    const panelImage = document.getElementById('panelImage');
    const panelImageCaption = document.getElementById('panelImageCaption');

    nodes.forEach(node => {
        node.addEventListener('click', (e) => {
            // Prevent showing panel if clicked on collapse toggle
            if (e.target.closest('.node-toggle')) return;
            
            const nodeId = node.id;
            const data = nodeDetails[nodeId];
            
            if (!data) return;

            // Highlight selected node
            nodes.forEach(n => n.classList.remove('selected-node'));
            node.classList.add('selected-node');

            // Populate side panel content
            panelCategory.textContent = data.category;
            panelTitle.textContent = data.title;
            panelSubtitle.textContent = data.subtitle || '';
            panelDesc.innerHTML = data.desc;
            
            // Bullets list
            panelBullets.innerHTML = '';
            data.bullets.forEach(bullet => {
                const li = document.createElement('li');
                li.innerHTML = bullet;
                panelBullets.appendChild(li);
            });

            // Statistics card
            panelStatLabel.textContent = data.statLabel;
            panelStatValue.textContent = data.statValue;
            panelStatDesc.textContent = data.statDesc;

            // Image handling (hide wrapper if no image available)
            if (data.image) {
                panelImage.src = data.image;
                panelImageCaption.textContent = data.imageCaption || '';
                panelImageWrapper.style.display = 'block';
            } else {
                panelImageWrapper.style.display = 'none';
            }

            // Slide in the panel
            detailPanel.classList.add('open');
            document.body.style.overflow = 'hidden'; // Lock background page scroll
        });
    });

    // Close panel events
    closePanelBtn.addEventListener('click', closePanel);
    
    // Close panel when clicking outside viewport on main page
    document.addEventListener('click', (e) => {
        if (!detailPanel.classList.contains('open')) return;
        // If clicking outside panel and nodes, close
        if (!e.target.closest('.node-detail-panel') && !e.target.closest('.mindmap-node')) {
            closePanel();
        }
    });

    function closePanel() {
        detailPanel.classList.remove('open');
        nodes.forEach(n => n.classList.remove('selected-node'));
        document.body.style.overflow = ''; // Unlock background page scroll
    }


    // --- 9. INTERACTIVE INFOGRAPHIC VIEWER (ZOOM & DRAG-PAN) ---
    const infoContainer = document.getElementById('infographicDragContainer');
    const infoImage = document.getElementById('infographicImage');

    let infoScale = 1.0;
    let infoX = 0;
    let infoY = 0;
    let infoIsDragging = false;
    let infoStartX = 0;
    let infoStartY = 0;

    function updateInfoTransform() {
        if (infoImage) {
            infoImage.style.transform = `translate(${infoX}px, ${infoY}px) scale(${infoScale})`;
        }
    }

    if (infoContainer && infoImage) {
        // Drag logic
        infoContainer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            infoIsDragging = true;
            infoStartX = e.clientX - infoX;
            infoStartY = e.clientY - infoY;
            infoContainer.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!infoIsDragging) return;
            infoX = e.clientX - infoStartX;
            infoY = e.clientY - infoStartY;
            updateInfoTransform();
        });

        window.addEventListener('mouseup', () => {
            infoIsDragging = false;
            if (infoContainer) infoContainer.style.cursor = 'grab';
        });

        infoContainer.addEventListener('mouseleave', () => {
            infoIsDragging = false;
        });

        // Wheel zoom logic
        infoContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const factor = 1.1;
            const oldScale = infoScale;

            if (e.deltaY < 0) {
                infoScale = Math.min(5.0, infoScale * factor);
            } else {
                infoScale = Math.max(0.6, infoScale / factor);
            }

            // Adjust translation coordinates to keep mouse focused
            const rect = infoContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - rect.width / 2;
            const mouseY = e.clientY - rect.top - rect.height / 2;

            infoX = mouseX - (mouseX - infoX) * (infoScale / oldScale);
            infoY = mouseY - (mouseY - infoY) * (infoScale / oldScale);

            updateInfoTransform();
        }, { passive: false });

        // Touch Drag & Pinch Zoom for Infographic on mobile
        let infoInitTouchDist = 0;
        let infoInitScale = 1.0;

        infoContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                infoIsDragging = true;
                infoStartX = e.touches[0].clientX - infoX;
                infoStartY = e.touches[0].clientY - infoY;
            } else if (e.touches.length === 2) {
                infoIsDragging = false;
                infoInitTouchDist = getTouchDistance(e.touches[0], e.touches[1]);
                infoInitScale = infoScale;
            }
        }, { passive: true });

        infoContainer.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && infoIsDragging) {
                e.preventDefault();
                infoX = e.touches[0].clientX - infoStartX;
                infoY = e.touches[0].clientY - infoStartY;
                updateInfoTransform();
            } else if (e.touches.length === 2 && infoInitTouchDist > 0) {
                e.preventDefault();
                const dist = getTouchDistance(e.touches[0], e.touches[1]);
                const factor = dist / infoInitTouchDist;
                
                const oldScale = infoScale;
                infoScale = Math.min(5.0, Math.max(0.6, infoInitScale * factor));
                
                const rect = infoContainer.getBoundingClientRect();
                const touchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left - rect.width / 2;
                const touchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top - rect.height / 2;
                
                infoX = touchCenterX - (touchCenterX - infoX) * (infoScale / oldScale);
                infoY = touchCenterY - (touchCenterY - infoY) * (infoScale / oldScale);
                
                updateInfoTransform();
            }
        }, { passive: false });

        infoContainer.addEventListener('touchend', () => {
            infoIsDragging = false;
            infoInitTouchDist = 0;
        });

        // Tool buttons zoom triggers
        document.getElementById('infoZoomIn').addEventListener('click', () => {
            infoScale = Math.min(5.0, infoScale * 1.25);
            updateInfoTransform();
        });

        document.getElementById('infoZoomOut').addEventListener('click', () => {
            infoScale = Math.max(0.6, infoScale / 1.25);
            updateInfoTransform();
        });

        document.getElementById('infoReset').addEventListener('click', () => {
            infoScale = 1.0;
            infoX = 0;
            infoY = 0;
            updateInfoTransform();
        });
    }

    // --- 10. INFOGRAPHIC FULLSCREEN LIGHTBOX MODAL ---
    const infoFullscreenBtn = document.getElementById('infoFullscreen');
    const lightbox = document.getElementById('infographicLightbox');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxImgWrapper = document.getElementById('lightboxImgWrapper');
    const lightboxImage = document.getElementById('lightboxImage');

    let lbScale = 1.0;
    let lbX = 0;
    let lbY = 0;
    let lbIsDragging = false;
    let lbStartX = 0;
    let lbStartY = 0;

    function updateLightboxTransform() {
        if (lightboxImage) {
            lightboxImage.style.transform = `translate(${lbX}px, ${lbY}px) scale(${lbScale})`;
        }
    }

    if (infoFullscreenBtn && lightbox && lightboxImage) {
        // Open Lightbox fullscreen
        infoFullscreenBtn.addEventListener('click', () => {
            lightbox.classList.add('open');
            lbScale = 1.0;
            lbX = 0;
            lbY = 0;
            updateLightboxTransform();
            document.body.style.overflow = 'hidden'; // Lock page scroll
        });

        // Close Lightbox
        lightboxClose.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxImgWrapper) {
                closeLightbox();
            }
        });

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.style.overflow = ''; // Unlock page scroll
        }

        // Drag inside Lightbox
        lightboxImgWrapper.addEventListener('mousedown', (e) => {
            e.preventDefault();
            lbIsDragging = true;
            lbStartX = e.clientX - lbX;
            lbStartY = e.clientY - lbY;
            lightboxImgWrapper.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!lbIsDragging) return;
            lbX = e.clientX - lbStartX;
            lbY = e.clientY - lbStartY;
            updateLightboxTransform();
        });

        window.addEventListener('mouseup', () => {
            lbIsDragging = false;
            if (lightboxImgWrapper) lightboxImgWrapper.style.cursor = 'grab';
        });

        // Wheel Zoom inside Lightbox
        lightboxImgWrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            const factor = 1.1;
            const oldScale = lbScale;

            if (e.deltaY < 0) {
                lbScale = Math.min(6.0, lbScale * factor);
            } else {
                lbScale = Math.max(0.8, lbScale / factor);
            }

            const rect = lightboxImgWrapper.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - rect.width / 2;
            const mouseY = e.clientY - rect.top - rect.height / 2;

            lbX = mouseX - (mouseX - lbX) * (lbScale / oldScale);
            lbY = mouseY - (mouseY - lbY) * (lbScale / oldScale);

            updateLightboxTransform();
        }, { passive: false });

        // Touch Drag & Pinch Zoom for Lightbox on mobile
        let lbInitTouchDist = 0;
        let lbInitScale = 1.0;

        lightboxImgWrapper.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                lbIsDragging = true;
                lbStartX = e.touches[0].clientX - lbX;
                lbStartY = e.touches[0].clientY - lbY;
            } else if (e.touches.length === 2) {
                lbIsDragging = false;
                lbInitTouchDist = getTouchDistance(e.touches[0], e.touches[1]);
                lbInitScale = lbScale;
            }
        }, { passive: true });

        lightboxImgWrapper.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && lbIsDragging) {
                e.preventDefault();
                lbX = e.touches[0].clientX - lbStartX;
                lbY = e.touches[0].clientY - lbY;
                updateLightboxTransform();
            } else if (e.touches.length === 2 && lbInitTouchDist > 0) {
                e.preventDefault();
                const dist = getTouchDistance(e.touches[0], e.touches[1]);
                const factor = dist / lbInitTouchDist;
                
                const oldScale = lbScale;
                lbScale = Math.min(6.0, Math.max(0.8, lbInitScale * factor));
                
                const rect = lightboxImgWrapper.getBoundingClientRect();
                const touchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left - rect.width / 2;
                const touchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top - rect.height / 2;
                
                lbX = touchCenterX - (touchCenterX - lbX) * (lbScale / oldScale);
                lbY = touchCenterY - (touchCenterY - lbY) * (lbScale / oldScale);
                
                updateLightboxTransform();
            }
        }, { passive: false });

        lightboxImgWrapper.addEventListener('touchend', () => {
            lbIsDragging = false;
            lbInitTouchDist = 0;
        });
    }
});
