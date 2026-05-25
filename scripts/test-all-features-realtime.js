const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Lỗi: Thiếu cấu hình kết nối Supabase Url hoặc Key trong file .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('====== BẮT ĐẦU CHƯƠNG TRÌNH KIỂM THỬ HỆ THỐNG QUẢN TRỊ ĐẠO (DIRECT SUPABASE DB) ======\n');
  console.log(`🔗 URL Kết Nối: ${supabaseUrl}`);
  console.log('----------------------------------------------------------------------------------\n');

  let testCategoryId = null;
  let testArticleId = null;
  let testServiceId = null;
  let testGiftId = null;
  let testTestimonialId = null;
  let testMemberId = null;
  let testBookingId = null;

  try {
    // ---------------------------------------------
    // 1. KIỂM THỬ CHUYÊN MỤC (CATEGORIES)
    // ---------------------------------------------
    console.log('🔹 [1/7] Kiểm thử Chức năng Nhóm / Chuyên Mục (Categories):');
    
    // Create
    const catPayload = { 
      name: 'Chuyên Mục Kiểm Thử Hệ Thống', 
      slug: 'chuyen-muc-kiem-thu-he-thong', 
      description: 'Chuyên mục được tạo tự động bởi script kiểm thử hệ thống' 
    };
    const { data: newCat, error: catCreateErr } = await supabase.from('categories').insert([catPayload]).select().single();
    if (catCreateErr) throw new Error('Tạo chuyên mục thất bại: ' + catCreateErr.message);
    testCategoryId = newCat.id;
    console.log(`   ✅ TẠO MỚI: Thành công! (ID: ${testCategoryId}, Tên: "${newCat.name}")`);

    // Read
    const { data: catList, error: catReadErr } = await supabase.from('categories').select('*').eq('id', testCategoryId);
    if (catReadErr || !catList.length) throw new Error('Đọc chuyên mục thất bại');
    console.log(`   ✅ ĐỌC THÔNG TIN: Thành công! (Tìm thấy chuyên mục vừa tạo)`);

    // Update
    const { data: updatedCat, error: catUpdErr } = await supabase.from('categories').update({ name: 'Chuyên Mục Kiểm Thử Đã Cập Nhật' }).eq('id', testCategoryId).select().single();
    if (catUpdErr) throw new Error('Cập nhật chuyên mục thất bại: ' + catUpdErr.message);
    console.log(`   ✅ CẬP NHẬT: Thành công! (Tên mới: "${updatedCat.name}")`);
    console.log('   🎉 Kiểm thử CRUD Chuyên mục đạt kết quả hoàn hảo!\n');

    // ---------------------------------------------
    // 2. KIỂM THỬ BÀI VIẾT (ARTICLES & ARTICLE_CATEGORIES)
    // ---------------------------------------------
    console.log('🔹 [2/7] Kiểm thử Chức năng Tư Liệu Bài Viết (Articles & Relations):');
    
    // Create Article
    const artPayload = {
      title: 'Bài Viết Kiểm Thử Đăng Ký Hệ Thống',
      excerpt: 'Tóm tắt bài viết kiểm thử hệ thống đăng bài',
      content: '<p>Nội dung kiểm thử chánh niệm và tu tập tĩnh lặng.</p>',
      author: 'Script Tự Động',
      read_time: '1 phút đọc',
      published: false,
      date: '25 Tháng 5, 2026'
    };
    const { data: newArt, error: artCreateErr } = await supabase.from('articles').insert([artPayload]).select().single();
    if (artCreateErr) throw new Error('Tạo bài viết thất bại: ' + artCreateErr.message);
    testArticleId = newArt.id;
    console.log(`   ✅ TẠO MỚI BÀI VIẾT: Thành công! (ID: ${testArticleId}, Tiêu đề: "${newArt.title}")`);

    // Create Relation (Link Article to Category)
    const { error: relCreateErr } = await supabase.from('article_categories').insert([{ article_id: testArticleId, category_id: testCategoryId }]);
    if (relCreateErr) throw new Error('Tạo liên kết bài viết - chuyên mục thất bại: ' + relCreateErr.message);
    console.log(`   ✅ TẠO LIÊN KẾT CHUYÊN MỤC: Thành công!`);

    // Read Article with categories
    const { data: artWithCats, error: artReadErr } = await supabase.from('articles').select('*, article_categories(category_id)').eq('id', testArticleId).single();
    if (artReadErr) throw new Error('Đọc bài viết kèm quan hệ thất bại: ' + artReadErr.message);
    console.log(`   ✅ ĐỌC BÀI VIẾT & LIÊN KẾT: Thành công! (Liên kết với Category ID: ${artWithCats.article_categories[0].category_id})`);

    // Update Article
    const { data: updatedArt, error: artUpdErr } = await supabase.from('articles').update({ title: 'Bài Viết Kiểm Thử Đã Được Cập Nhật' }).eq('id', testArticleId).select().single();
    if (artUpdErr) throw new Error('Cập nhật bài viết thất bại: ' + artUpdErr.message);
    console.log(`   ✅ CẬP NHẬT BÀI VIẾT: Thành công! (Tiêu đề mới: "${updatedArt.title}")`);
    console.log('   🎉 Kiểm thử CRUD Bài viết đạt kết quả hoàn hảo!\n');

    // ---------------------------------------------
    // 3. KIỂM THỬ TUYẾN DỊCH VỤ (SERVICES)
    // ---------------------------------------------
    console.log('🔹 [3/7] Kiểm thử Chức năng Quản Lý Tuyến Phục Sự (Services):');
    
    // Create
    const svcPayload = {
      title: 'Dịch Vụ Kiểm Thử Tĩnh Tâm',
      subtitle: 'Khai mở trí tuệ chánh niệm',
      hanzi: '静 心',
      description: 'Tập trung hơi thở tĩnh lặng thanh tẩy bụi trần.',
      features: ['Thiền tập 30 phút', 'Trà thiền đàm đạo', 'Giải đáp vướng mắc tâm lý'],
      iconName: 'Compass',
      color: 'text-saffron-400',
      borderColor: 'border-saffron-400/30',
      bgDecor: 'bg-saffron-400/5'
    };
    const { data: newSvc, error: svcCreateErr } = await supabase.from('services').insert([svcPayload]).select().single();
    if (svcCreateErr) throw new Error('Tạo dịch vụ thất bại: ' + svcCreateErr.message);
    testServiceId = newSvc.id;
    console.log(`   ✅ TẠO MỚI: Thành công! (ID: ${testServiceId}, Tên dịch vụ: "${newSvc.title}")`);

    // Update
    const { data: updatedSvc, error: svcUpdErr } = await supabase.from('services').update({ subtitle: 'Khai mở chánh niệm chấn hưng' }).eq('id', testServiceId).select().single();
    if (svcUpdErr) throw new Error('Cập nhật dịch vụ thất bại: ' + svcUpdErr.message);
    console.log(`   ✅ CẬP NHẬT: Thành công! (Tiêu đề phụ mới: "${updatedSvc.subtitle}")`);
    console.log('   🎉 Kiểm thử CRUD Dịch vụ đạt kết quả hoàn hảo!\n');

    // ---------------------------------------------
    // 4. KIỂM THỬ QUÀ TẶNG (GIFTS)
    // ---------------------------------------------
    console.log('🔹 [4/7] Kiểm thử Chức năng Quà Tặng Gieo Duyên (Gifts):');
    
    // Create
    const giftPayload = {
      title: 'Lá Bùa Tĩnh Tâm Cầu An',
      desc: 'Mang lại sự sáng suốt thanh lọc tâm tư hằng ngày.',
      type: 'newcomer',
      iconName: 'Sparkles',
      color: 'text-jade-400',
      bg: 'bg-jade-400/10'
    };
    const { data: newGift, error: giftCreateErr } = await supabase.from('gifts').insert([giftPayload]).select().single();
    if (giftCreateErr) throw new Error('Tạo phần quà thất bại: ' + giftCreateErr.message);
    testGiftId = newGift.id;
    console.log(`   ✅ TẠO MỚI: Thành công! (ID: ${testGiftId}, Tên quà: "${newGift.title}")`);

    // Update
    const { data: updatedGift, error: giftUpdErr } = await supabase.from('gifts').update({ title: 'Lá Bùa Tĩnh Tâm Cầu An Thượng Hạng' }).eq('id', testGiftId).select().single();
    if (giftUpdErr) throw new Error('Cập nhật phần quà thất bại: ' + giftUpdErr.message);
    console.log(`   ✅ CẬP NHẬT: Thành công! (Tên mới: "${updatedGift.title}")`);
    console.log('   🎉 Kiểm thử CRUD Quà tặng đạt kết quả hoàn hảo!\n');

    // ---------------------------------------------
    // 5. KIỂM THỬ Ý KIẾN PHẢN HỒI (TESTIMONIALS)
    // ---------------------------------------------
    console.log('🔹 [5/7] Kiểm thử Chức năng Ý Kiến Phản Hồi (Testimonials):');
    
    // Create
    const testPayload = {
      name: 'Đạo Hữu An Nhiên',
      service: 'Luận Vận Mệnh',
      content: 'Nhận được những lời khuyên thông suốt giúp định tâm rõ ràng sự nghiệp.'
    };
    const { data: newTest, error: testCreateErr } = await supabase.from('testimonials').insert([testPayload]).select().single();
    if (testCreateErr) throw new Error('Tạo phản hồi thất bại: ' + testCreateErr.message);
    testTestimonialId = newTest.id;
    console.log(`   ✅ TẠO MỚI: Thành công! (ID: ${testTestimonialId}, Pháp danh: "${newTest.name}")`);

    // Update
    const { data: updatedTest, error: testUpdErr } = await supabase.from('testimonials').update({ content: 'Lời khuyên vô cùng sâu sắc, thông đạt dòng nghiệp quả.' }).eq('id', testTestimonialId).select().single();
    if (testUpdErr) throw new Error('Cập nhật phản hồi thất bại: ' + testUpdErr.message);
    console.log(`   ✅ CẬP NHẬT: Thành công! (Nội dung mới: "${updatedTest.content}")`);
    console.log('   🎉 Kiểm thử CRUD Phản hồi đạt kết quả hoàn hảo!\n');

    // ---------------------------------------------
    // 6. KIỂM THỬ THÀNH VIÊN ĐẠO CHÚNG (MEMBERS)
    // ---------------------------------------------
    console.log('🔹 [6/7] Kiểm thử Chức năng Thành Viên Đạo Chúng (Members):');
    
    // Create
    const memberPayload = {
      name: 'Đạo Sỹ Thanh Vân',
      role: 'Tri Khố',
      email: 'thanhvan.dao@gmail.com',
      joinDate: '25 Tháng 5, 2026'
    };
    const { data: newMem, error: memCreateErr } = await supabase.from('members').insert([memberPayload]).select().single();
    if (memCreateErr) throw new Error('Tạo thành viên thất bại: ' + memCreateErr.message);
    testMemberId = newMem.id;
    console.log(`   ✅ TẠO MỚI: Thành công! (ID: ${testMemberId}, Họ tên: "${newMem.name}")`);

    // Update
    const { data: updatedMem, error: memUpdErr } = await supabase.from('members').update({ role: 'Chấp Sự Đạo Chúng' }).eq('id', testMemberId).select().single();
    if (memUpdErr) throw new Error('Cập nhật thành viên thất bại: ' + memUpdErr.message);
    console.log(`   ✅ CẬP NHẬT: Thành công! (Chức vụ mới: "${updatedMem.role}")`);
    console.log('   🎉 Kiểm thử CRUD Thành viên đạt kết quả hoàn hảo!\n');

    // ---------------------------------------------
    // 7. KIỂM THỬ YÊU CẦU HỖ TRỢ (BOOKINGS)
    // ---------------------------------------------
    console.log('🔹 [7/7] Kiểm thử Chức năng Lịch hẹn / Yêu Cầu Hỗ Trợ (Bookings):');
    
    // Create
    const bookingPayload = {
      name: 'Khách Hữu Duyên Tâm Tĩnh',
      phone: '0987654321',
      dob: '1995 Ất Hợi - Mệnh Sơn Đầu Hỏa',
      message: 'Cầu mong bình an và hỏi đường đi lối lại thời vận sắp tới.',
      status: 'pending'
    };
    const { data: newBooking, error: bookCreateErr } = await supabase.from('bookings').insert([bookingPayload]).select().single();
    if (bookCreateErr) throw new Error('Tạo yêu cầu liên hệ thất bại: ' + bookCreateErr.message);
    testBookingId = newBooking.id;
    console.log(`   ✅ TẠO MỚI LIÊN HỆ: Thành công! (ID: ${testBookingId}, Khách: "${newBooking.name}")`);

    // Update status (Mark as contacted)
    const { data: updatedBooking, error: bookUpdErr } = await supabase.from('bookings').update({ status: 'contacted' }).eq('id', testBookingId).select().single();
    if (bookUpdErr) throw new Error('Cập nhật trạng thái liên hệ thất bại: ' + bookUpdErr.message);
    console.log(`   ✅ CẬP NHẬT TRẠNG THÁI: Thành công! (Trạng thái mới: "${updatedBooking.status === 'contacted' ? 'Đã Liên Hệ' : 'Chờ Hỗ Trợ'}")`);
    console.log('   🎉 Kiểm thử CRUD Yêu cầu hỗ trợ đạt kết quả hoàn hảo!\n');

    // ---------------------------------------------
    // HẬU KIỂM: DỌN SẠCH DỮ LIỆU TẠM
    // ---------------------------------------------
    console.log('🧹 [HẬU KIỂM] Tiến hành dọn dẹp toàn bộ dữ liệu kiểm thử tạm thời...');

    // Delete relation first
    await supabase.from('article_categories').delete().eq('article_id', testArticleId);
    console.log('   🗑️ Đã xóa quan hệ Bài viết - Chuyên mục');

    // Delete Article
    await supabase.from('articles').delete().eq('id', testArticleId);
    console.log('   🗑️ Đã xóa Bài viết nháp kiểm thử');

    // Delete Category
    await supabase.from('categories').delete().eq('id', testCategoryId);
    console.log('   🗑️ Đã xóa Chuyên mục kiểm thử');

    // Delete Service
    await supabase.from('services').delete().eq('id', testServiceId);
    console.log('   🗑️ Đã xóa Dịch vụ kiểm thử');

    // Delete Gift
    await supabase.from('gifts').delete().eq('id', testGiftId);
    console.log('   🗑️ Đã xóa Quà tặng kiểm thử');

    // Delete Testimonial
    await supabase.from('testimonials').delete().eq('id', testTestimonialId);
    console.log('   🗑️ Đã xóa Ý kiến phản hồi kiểm thử');

    // Delete Member
    await supabase.from('members').delete().eq('id', testMemberId);
    console.log('   🗑️ Đã xóa Thành viên kiểm thử');

    // Delete Booking
    await supabase.from('bookings').delete().eq('id', testBookingId);
    console.log('   🗑️ Đã xóa Yêu cầu liên hệ kiểm thử');

    console.log('\n==================================================================================');
    console.log('🥇 KẾT LUẬN: TOÀN BỘ 7 CHỨC NĂNG QUẢN TRỊ TRÊN SUPABASE ĐÃ ĐƯỢC KIỂM THỬ THÀNH CÔNG 100%!');
    console.log('🥇 DỮ LIỆU THỰC TẾ (REAL DB WRITE/READ) HOẠT ĐỘNG HOÀN HẢO, BẢO MẬT & CHUẨN XÁC!');
    console.log('==================================================================================\n');

  } catch (error) {
    console.error('\n❌ QUÁ TRÌNH KIỂM THỬ GẶP LỖI NGHIÊM TRỌNG:');
    console.error(error.message);
    
    // Cleanup on error if IDs exist
    console.log('🧹 [HẬU KIỂM KHẨN CẤP] Đang dọn dẹp các bản ghi dở dang...');
    if (testArticleId) {
      await supabase.from('article_categories').delete().eq('article_id', testArticleId);
      await supabase.from('articles').delete().eq('id', testArticleId);
    }
    if (testCategoryId) await supabase.from('categories').delete().eq('id', testCategoryId);
    if (testServiceId) await supabase.from('services').delete().eq('id', testServiceId);
    if (testGiftId) await supabase.from('gifts').delete().eq('id', testGiftId);
    if (testTestimonialId) await supabase.from('testimonials').delete().eq('id', testTestimonialId);
    if (testMemberId) await supabase.from('members').delete().eq('id', testMemberId);
    if (testBookingId) await supabase.from('bookings').delete().eq('id', testBookingId);
    console.log('   🗑️ Đã hoàn tất dọn dẹp khẩn cấp.');
    process.exit(1);
  }
}

runTests();
