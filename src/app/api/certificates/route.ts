import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const certCode = searchParams.get("code");

    if (certCode) {
      const cert = await prisma.certificate.findUnique({
        where: { certificateCode: certCode },
        include: {
          trainee: { include: { user: true } },
          course: {
            include: {
              trainer: { include: { user: true } },
            },
          },
        },
      });

      if (!cert) {
        return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
      }

      return NextResponse.json({
        certificate: {
          id: cert.id,
          certificateCode: cert.certificateCode,
          traineeName: cert.trainee.user.name,
          traineeOrg: cert.trainee.user.organization,
          traineeDesignation: cert.trainee.user.designation,
          courseTitle: cert.course.title,
          courseCode: cert.course.code,
          courseSubject: cert.course.subject,
          durationHours: cert.course.durationHours,
          trainerName: cert.course.trainer?.user?.name || "Dr. Rajesh Sharma",
          issuedOn: cert.issuedOn.toISOString(),
          grade: cert.grade,
        },
      });
    }

    let traineeProfile;
    if (userId) {
      traineeProfile = await prisma.traineeProfile.findUnique({ where: { userId } });
    } else {
      traineeProfile = await prisma.traineeProfile.findFirst();
    }

    const certs = await prisma.certificate.findMany({
      where: traineeProfile ? { traineeId: traineeProfile.id } : undefined,
      include: {
        trainee: { include: { user: true } },
        course: {
          include: {
            trainer: { include: { user: true } },
          },
        },
      },
      orderBy: { issuedOn: "desc" },
    });

    return NextResponse.json({
      certificates: certs.map((c) => ({
        id: c.id,
        certificateCode: c.certificateCode,
        traineeName: c.trainee.user.name,
        traineeOrg: c.trainee.user.organization,
        courseTitle: c.course.title,
        courseCode: c.course.code,
        trainerName: c.course.trainer?.user?.name || "Dr. Rajesh Sharma",
        issuedOn: c.issuedOn.toISOString(),
        grade: c.grade,
      })),
    });
  } catch (error) {
    console.error("Certificates API error:", error);
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}
